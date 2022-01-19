resource "aws_s3_bucket" "source_code_bucket" {
  bucket = random_pet.bucket_name.id
  acl    = "private"

  tags = {
    Environment = "Dev"
  }
}

resource "random_pet" "bucket_name" {}