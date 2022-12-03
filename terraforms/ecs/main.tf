terraform {
  required_version = "~> 1.1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }
  }

  backend "s3" {
    key     = "financial-app/miniature-fiesta/ecs/terraform.tfstate"
    encrypt = false
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_iam_role" "task" {
  name = format("task-role-%s", var.project_name)

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "task" {
  name = format("task-role-policy-%s", var.project_name)
  role = aws_iam_role.task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "execution" {
  name = format("execution-role-%s", var.project_name)

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "execution_policy" {
  name = format("execution-role-policy-%s", var.project_name)
  role = aws_iam_role.execution.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "null_resource" "renew_ecr_token" {
  triggers = {
    token_expired = data.aws_ecr_authorization_token.this.expires_at
  }

  provisioner "local-exec" {
    command = "echo ${data.aws_ecr_authorization_token.this.password} | docker login --username ${data.aws_ecr_authorization_token.this.user_name} --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com"
  }
}

resource "aws_ecs_task_definition" "this" {
  family                   = format("task-%s", var.project_name)
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([
    {
      name      = var.ecs.container_name
      image     = format("%s:latest", data.aws_ecr_repository.this.repository_url)
      essential = true
      portMappings = [
        {
          containerPort = var.ecs.container_port
          hostPort      = var.ecs.container_port
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = format("%s/%s", "/aws/ecs", lower(var.project_name))
          "awslogs-region"        = var.region
          "awslogs-create-group"  = "true"
          "awslogs-stream-prefix" = lower(var.project_name)
        }
      }
      environment = [
        {
          name  = "DB_HOST"
          value = data.aws_db_instance.this.address
        },
        {
          name  = "DB_PORT"
          value = format("%d", data.aws_db_instance.this.port)
        },
        {
          name  = "DB_USER"
          value = var.rds_user.username
        },
        {
          name  = "DB_PASSWORD"
          value = var.rds_user.password
        },
        {
          name  = "DB_NAME",
          value = data.aws_db_instance.this.db_name
        },
        {
          name  = "ECS_AVAILABLE_LOGGING_DRIVERS",
          value = "[\"awslogs\"]"
        }
      ]
    }
  ])

  depends_on = [
    null_resource.renew_ecr_token,
  ]
}


resource "aws_ecs_service" "this" {
  name                = format("%s-service-%s", var.context, var.project_name)
  cluster             = data.aws_ecs_cluster.this.id
  task_definition     = aws_ecs_task_definition.this.arn
  desired_count       = 1
  launch_type         = "FARGATE"
  platform_version    = "LATEST"
  scheduling_strategy = "REPLICA"

  network_configuration {
    security_groups  = [data.aws_security_group.allow_ingress.id]
    subnets          = [for subnet in data.aws_subnet.this : subnet.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.ecs.container_name
    container_port   = var.ecs.container_port
  }

  depends_on = [
    aws_ecs_task_definition.this
  ]
}
