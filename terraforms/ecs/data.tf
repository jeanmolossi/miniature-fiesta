data "aws_ecr_authorization_token" "this" {}

data "aws_caller_identity" "current" {}

data "aws_vpc" "this" {
  tags = {
    Name = format("vpc-%s", var.context)
  }
}

data "aws_ecs_cluster" "this" {
  cluster_name = var.context
}

data "aws_route53_zone" "this" {
  name         = var.route53_zone_name
  private_zone = false
}

data "aws_acm_certificate" "this" {
  domain   = var.route53_zone_name
  statuses = ["ISSUED"]
}

data "aws_security_group" "allow_ingress" {
  name = "allow_ingress"

  filter {
    name   = "tag:Name"
    values = ["sg-${var.base_infra}"]
  }
}

data "aws_subnets" "this" {
  filter {
    name   = "tag:Name"
    values = ["subnet-${var.base_infra}"]
  }
}

data "aws_subnet" "this" {
  for_each = toset(data.aws_subnets.this.ids)
  id       = each.value
}

data "aws_lb" "this" {
  name = format("alb-%s", var.context)
}

data "aws_ecr_repository" "this" {
  name = lower(var.project_name)
}

data "aws_ecr_image" "this" {
  repository_name = lower(var.project_name)
  image_tag       = "latest"
}

data "aws_db_instance" "this" {
  db_instance_identifier = format("dbid-%s-%s", lower(var.context), lower(var.project_name))
}
