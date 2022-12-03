variable "context" {
  type        = string
  description = "The project context"
}

variable "base_infra" {
  type        = string
  description = "The name of base infra project"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
}

variable "repository_source" {
  type        = string
  description = "The github address's project"
}

variable "region" {
  type        = string
  description = "The AWS region"
}

variable "route53_zone_name" {
  type        = string
  description = "The name of the Route53 zone"
}

// -------- App vars

variable "ecs" {
  type = object({
    container_name   = string
    container_port   = number
    healthcheck_path = string
  })
  description = "The ecs container configuration"
}

// -------- App vars

variable "rds" {
  type = object({
    is_public             = bool
    backup_retention_days = number
    storage_type          = string
  })
}

variable "rds_user" {
  type = object({
    username = string
    password = string
  })
}
