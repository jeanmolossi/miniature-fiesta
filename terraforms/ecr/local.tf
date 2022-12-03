locals {
  default_tags = {
    Context     = var.context
    ProjectName = var.project_name
    Repository  = var.repository_source
    Mainteiner  = "Terraform"
  }
}
