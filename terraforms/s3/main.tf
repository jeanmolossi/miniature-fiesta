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

resource "aws_s3_bucket" "this" {
  bucket        = format("cdn-%s", lower(var.project_name))
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
