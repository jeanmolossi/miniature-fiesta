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
