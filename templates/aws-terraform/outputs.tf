output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.development.invoke_url
}

# --------------------------------- DONT REMOVE ----------------------------------- #
output "source_bucket" {
  value = aws_s3_bucket.source_code_bucket.bucket_domain_name
  description = "This one has to be here so we can use it in our fast build"
}
