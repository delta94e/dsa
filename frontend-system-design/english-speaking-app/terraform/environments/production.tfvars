# Production environment values
aws_region      = "ap-southeast-1"
environment     = "production"
cluster_name    = "speakup-cluster"
cluster_version = "1.29"

vpc_cidr           = "10.0.0.0/16"
availability_zones = ["ap-southeast-1a", "ap-southeast-1b", "ap-southeast-1c"]

node_instance_types = ["t3.medium"]
node_desired_size   = 2
node_min_size       = 2
node_max_size       = 10
