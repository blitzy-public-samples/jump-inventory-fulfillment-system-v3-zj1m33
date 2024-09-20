# AWS Region
variable "aws_region" {
  type        = string
  description = "The AWS region where resources will be created"
  default     = "us-west-2"
}

# Environment
variable "environment" {
  type        = string
  description = "The deployment environment (e.g., dev, staging, prod)"
  default     = "dev"
}

# VPC Configuration
variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "List of CIDR blocks for private subnets"
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

# RDS Configuration
variable "db_username" {
  type        = string
  description = "Username for the RDS instance"
  sensitive   = true
}

variable "db_password" {
  type        = string
  description = "Password for the RDS instance"
  sensitive   = true
}

variable "db_instance_class" {
  type        = string
  description = "Instance class for the RDS instance"
  default     = "db.t3.micro"
}

# ECS Configuration
variable "ecs_task_cpu" {
  type        = string
  description = "CPU units for the ECS task"
  default     = "256"
}

variable "ecs_task_memory" {
  type        = string
  description = "Memory for the ECS task in MiB"
  default     = "512"
}

variable "app_count" {
  type        = number
  description = "Number of Docker containers to run"
  default     = 2
}

# Application Configuration
variable "domain_name" {
  type        = string
  description = "Domain name for the application"
  default     = ""
}