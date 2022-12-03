context           = "financial-app"
project_name      = "APP-miniature-fiesta"
repository_source = "https://github.com/jeanmolossi/miniature-fiesta"
route53_zone_name = "jeanmolossi.com.br"
base_infra		  = "financial-base-infra"

ecs = {
	container_name = "APP-miniature-fiesta"
	container_port = "3000"
	healthcheck_path = "/ping"
}

ecr = {
	max_old_images = 5
}

rds = {
	is_public = true
	backup_retention_days = 1
	storage_type = "gp2"
}
