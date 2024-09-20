# Configure the AWS provider
provider "aws" {
  region = var.aws_region
}

# Create a VPC
resource "aws_vpc" "inventory_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "Inventory VPC"
  }
}

# Create public subnets
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.inventory_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "Public Subnet ${count.index + 1}"
  }
}

# Create an Internet Gateway
resource "aws_internet_gateway" "inventory_igw" {
  vpc_id = aws_vpc.inventory_vpc.id

  tags = {
    Name = "Inventory IGW"
  }
}

# Create a route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.inventory_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.inventory_igw.id
  }

  tags = {
    Name = "Public Route Table"
  }
}

# Associate public subnets with the public route table
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Create a security group for the application
resource "aws_security_group" "inventory_sg" {
  name        = "inventory_sg"
  description = "Security group for the Inventory Management application"
  vpc_id      = aws_vpc.inventory_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Inventory Security Group"
  }
}

# Create an RDS instance for PostgreSQL
resource "aws_db_instance" "inventory_db" {
  identifier        = "inventory-db"
  engine            = "postgres"
  engine_version    = "13.7"
  instance_class    = var.db_instance_class
  allocated_storage = 20
  username          = var.db_username
  password          = var.db_password
  db_name           = "inventory_db"

  vpc_security_group_ids = [aws_security_group.inventory_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.inventory.name

  skip_final_snapshot = true

  tags = {
    Name = "Inventory Database"
  }
}

# Create an ElastiCache cluster for Redis
resource "aws_elasticache_cluster" "inventory_redis" {
  cluster_id           = "inventory-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.inventory.name
  security_group_ids = [aws_security_group.inventory_sg.id]

  tags = {
    Name = "Inventory Redis"
  }
}

# Create an ECS cluster
resource "aws_ecs_cluster" "inventory" {
  name = "inventory-cluster"

  tags = {
    Name = "Inventory ECS Cluster"
  }
}

# Create an ECS task definition
resource "aws_ecs_task_definition" "inventory" {
  family                   = "inventory-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory

  container_definitions = file("container-definitions.json")
}

# Create an ECS service
resource "aws_ecs_service" "inventory" {
  name            = "inventory-service"
  cluster         = aws_ecs_cluster.inventory.id
  task_definition = aws_ecs_task_definition.inventory.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.inventory_sg.id]
    assign_public_ip = true
  }
}

# Data source for availability zones
data "aws_availability_zones" "available" {}

# Create a DB subnet group
resource "aws_db_subnet_group" "inventory" {
  name       = "inventory-db-subnet-group"
  subnet_ids = aws_subnet.public[*].id

  tags = {
    Name = "Inventory DB Subnet Group"
  }
}

# Create an ElastiCache subnet group
resource "aws_elasticache_subnet_group" "inventory" {
  name       = "inventory-cache-subnet-group"
  subnet_ids = aws_subnet.public[*].id
}