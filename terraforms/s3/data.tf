data "aws_acm_certificate" "this" {
  domain   = format("*.%s", var.route53_zone_name)
  statuses = ["ISSUED"]
}

data "aws_route53_zone" "this" {
  name         = var.route53_zone_name
  private_zone = false
}
