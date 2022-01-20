provider "aws" {
  region = var.aws_region
}

data "aws_region" "current" {}


terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.48.0"
    }
  }
  backend "s3" {
    bucket = ""
    key    = ""
    region = "eu-central-1"
  }
  required_version = "~> 1.0"
}
