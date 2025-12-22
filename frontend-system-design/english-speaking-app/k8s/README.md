# Kubernetes & Terraform Setup

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0
- kubectl
- Helm 3
- Kustomize (included in kubectl)

## Structure

```
k8s/
├── base/                        # Base manifests
│   ├── kustomization.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── services.yaml
│   ├── config.yaml
│   └── hpa.yaml
├── overlays/
│   ├── staging/                 # Staging overrides
│   │   └── kustomization.yaml
│   └── production/              # Production overrides
│       ├── kustomization.yaml
│       └── ingress.yaml
└── README.md

terraform/
├── main.tf
├── variables.tf
├── vpc.tf
├── eks.tf
├── helm.tf
├── outputs.tf
└── environments/
    ├── production.tfvars
    └── staging.tfvars
```

## Terraform Commands

### Initialize
```bash
cd terraform
terraform init
```

### Plan (Staging)
```bash
terraform plan -var-file=environments/staging.tfvars
```

### Apply (Staging)
```bash
terraform apply -var-file=environments/staging.tfvars
```

### Production
```bash
terraform apply -var-file=environments/production.tfvars
```

## Kubernetes Deployment

### Configure kubectl
```bash
aws eks update-kubeconfig --region ap-southeast-1 --name speakup-cluster
```

### Apply manifests
```bash
# Create namespace
kubectl create namespace speakup

# Apply config and secrets first
kubectl apply -f k8s/config.yaml -n speakup

# Apply deployments and services
kubectl apply -f k8s/frontend-deployment.yaml -n speakup
kubectl apply -f k8s/backend-deployment.yaml -n speakup
kubectl apply -f k8s/services.yaml -n speakup

# Apply ingress
kubectl apply -f k8s/ingress.yaml -n speakup

# Apply HPA
kubectl apply -f k8s/hpa.yaml -n speakup
```

### Check status
```bash
kubectl get pods -n speakup
kubectl get svc -n speakup
kubectl get ingress -n speakup
```

## Update Images

```bash
# Update frontend
kubectl set image deployment/frontend frontend=ghcr.io/your-username/english-speaking-app-frontend:v1.2.0 -n speakup

# Update backend
kubectl set image deployment/backend backend=ghcr.io/your-username/english-speaking-app-backend:v1.2.0 -n speakup
```

## Scaling

```bash
# Manual scaling
kubectl scale deployment frontend --replicas=5 -n speakup

# HPA will auto-scale based on CPU/memory
kubectl get hpa -n speakup
```

## Estimated AWS Costs (Production)

| Resource | Monthly Cost |
|----------|--------------|
| EKS Cluster | ~$72 |
| 2x t3.medium | ~$60 |
| NAT Gateway | ~$32 |
| Load Balancer | ~$16 |
| **Total** | **~$180/month** |

*Costs vary by region and usage*
