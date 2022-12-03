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
    key     = "financial-app/miniature-fiesta/s3/terraform.tfstate"
    encrypt = false
  }
}

provider "aws" {
  region = "us-east-1"
}

# https://www.alexhyett.com/terraform-s3-static-website-hosting/#s3tf

resource "aws_s3_bucket" "this" {
  bucket        = format("cdn-%s.%s", lower(var.project_name), var.route53_zone_name)
  acl           = "public-read"
  force_destroy = true
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = templatefile("policies/bucket-policy.json", { bucket_arn = aws_s3_bucket.this.arn })
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }

  depends_on = [
    aws_s3_bucket.this
  ]
}

resource "null_resource" "build" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "yarn install && yarn build"
  }

  depends_on = [
    aws_s3_bucket_website_configuration.this
  ]
}

resource "null_resource" "upload" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws s3 sync ../../.next/static s3://${aws_s3_bucket.this.bucket}/_next/static"
  }

  depends_on = [
    null_resource.build
  ]
}

output "s3_domain" {
  value = aws_s3_bucket.this.bucket_domain_name
}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = aws_s3_bucket.this.bucket_domain_name
    origin_id   = format("origin-%s", aws_s3_bucket.this.bucket)
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = ["cdn.${var.route53_zone_name}"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = format("origin-%s", aws_s3_bucket.this.bucket)

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 300
    default_ttl            = 300
    max_ttl                = 31536000
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["BR"]
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.this.arn
    ssl_support_method  = "sni-only"
  }

  depends_on = [
    aws_s3_bucket.this
  ]
}

resource "aws_route53_record" "this" {
  zone_id = data.aws_route53_zone.this.id
  name    = format("cdn.%s", var.route53_zone_name)
  type    = "CNAME"
  ttl     = 300
  records = [aws_cloudfront_distribution.this.domain_name]

  depends_on = [
    aws_cloudfront_distribution.this
  ]
}
