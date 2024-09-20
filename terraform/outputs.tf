# Output values for the Inventory Management and Fulfillment Application

# Network outputs
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.inventory_vpc.id
}

output "public_subnet_ids" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

# Database outputs
output "db_endpoint" {
  description = "Endpoint for the RDS instance"
  value       = aws_db_instance.inventory.endpoint
}

output "redis_endpoint" {
  description = "Endpoint for the ElastiCache Redis cluster"
  value       = aws_elasticache_cluster.inventory.cache_nodes[0].address
}

# ECS outputs
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.inventory.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.inventory.name
}

# Load Balancer output
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.inventory.dns_name
}

# CloudFront output
output "cloudfront_distribution_domain" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.inventory.domain_name
}

# TODO: Add any additional outputs needed for monitoring, debugging, or CI/CD integration
# TODO: Consider adding outputs for IAM roles or security group IDs if needed
# TODO: Ensure all outputs align with documentation and operational procedures