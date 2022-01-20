module "hello_world" {
  source        = "./lambda_module"
  lambdaName    = "helloWorld"
  file_path     = "${path.module}/../dist/helloWorld.zip"
  s3_bucket     = aws_s3_bucket.source_code_bucket.id
  executing_agw = aws_apigatewayv2_api.development.execution_arn
}

resource "aws_apigatewayv2_integration" "hello_world" {
  api_id = aws_apigatewayv2_api.development.id

  integration_uri    = module.hello_world.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "hello_world" {
  api_id = aws_apigatewayv2_api.development.id

  route_key = "GET /"
  target    = "integrations/${aws_apigatewayv2_integration.hello_world.id}"
}