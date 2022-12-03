terraform {
  required_version = "~> 1.1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }

  backend "s3" {
    key     = "financial-app/miniature-fiesta/ecr/terraform.tfstate"
    encrypt = false
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "this" {
  name                 = lower(var.project_name)
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository_policy" "this" {
  repository = aws_ecr_repository.this.name
  policy     = file("${path.module}/policies/ecr-policy.json")
}

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = format("Keep last %d images", var.ecr.max_old_images)
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = var.ecr.max_old_images
      }
    }]
  })
}

resource "null_resource" "build" {
  provisioner "local-exec" {
    command = "cd ../../ && docker build -t ${lower(var.project_name)} ."
  }
}

resource "null_resource" "renew_ecr_token" {
  triggers = {
    token_expired = data.aws_ecr_authorization_token.this.expires_at
  }

  provisioner "local-exec" {
    command = "echo ${data.aws_ecr_authorization_token.this.password} | docker login --username ${data.aws_ecr_authorization_token.this.user_name} --password-stdin ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com"
  }

  depends_on = [
    null_resource.build,
    aws_ecr_repository.this
  ]
}

resource "null_resource" "tag_and_push" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "docker tag ${lower(var.project_name)}:latest ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.project_name)}:latest && docker push ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.project_name)}:latest"
  }

  depends_on = [aws_ecr_repository.this, null_resource.build, null_resource.renew_ecr_token]
}
