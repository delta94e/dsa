# Staging environment values
aws_region      = "ap-southeast-1"
environment     = "staging"
cluster_name    = "speakup-staging"
cluster_version = "1.29"

vpc_cidr           = "10.1.0.0/16"
availability_zones = ["ap-southeast-1a", "ap-southeast-1b"]

node_instance_types = ["t3.small"]
node_desired_size   = 1
node_min_size       = 1
node_max_size       = 3
