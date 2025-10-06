# Acme IT - AKS Demo

Simple static IT website containerized with Nginx, deployed to Azure Kubernetes Service (AKS) using GitHub Actions.

## Prerequisites
- Azure subscription with permissions to create AKS and ACR
- Azure CLI (`az`) installed locally if running commands
- GitHub repository for this code

## Azure Setup (one-time)
1. Create a Resource Group:
   ```bash
   az group create -n rg-acme -l eastus
   ```
2. Create Azure Container Registry (ACR):
   ```bash
   az acr create -n <ACR_NAME> -g rg-acme --sku Basic
   az acr show -n <ACR_NAME> --query loginServer -o tsv
   ```
3. Create AKS cluster and attach ACR:
   ```bash
   az aks create -g rg-acme -n aks-acme --node-count 1 --attach-acr <ACR_NAME>
   ```

## GitHub Configuration
Set these repository variables and secrets.

Variables (Settings → Secrets and variables → Actions → Variables):
- `ACR_NAME`: your ACR name (e.g. myregistry)
- `ACR_LOGIN_SERVER`: login server from ACR (e.g. myregistry.azurecr.io)
- `AKS_RESOURCE_GROUP`: e.g. rg-acme
- `AKS_CLUSTER_NAME`: e.g. aks-acme

Secrets (Settings → Secrets and variables → Actions → Secrets):
- `AZURE_CLIENT_ID`: workload identity app registration client ID (or service principal client ID)
- `AZURE_TENANT_ID`: your Azure tenant ID
- `AZURE_SUBSCRIPTION_ID`: your subscription ID

Tip: You can use `azure/login` with OIDC and a Federated Credential. See Microsoft docs to set up GitHub OIDC for Azure.

## Deploy via GitHub Actions
- Push to `main` triggers build and deploy
- Workflow: `.github/workflows/deploy.yml`
- Image is tagged with commit SHA and `latest`

## Kubernetes Manifests
- Namespace: `k8s/namespace.yaml`
- Deployment: `k8s/deployment.yaml` (image updated at deploy time)
- Service: `k8s/service.yaml`
- Ingress (optional): `k8s/ingress.yaml` (set host and ensure NGINX Ingress Controller exists)

If you don’t have an ingress controller, you can expose using a LoadBalancer service temporarily:
```bash
kubectl -n acme-it patch svc acme-it-web -p '{"spec": {"type": "LoadBalancer"}}'
```

## Local build and run
```bash
docker build -t acme-it-web:dev .
docker run --rm -p 8080:80 acme-it-web:dev
# Open http://localhost:8080
```

## Notes
- Update `k8s/ingress.yaml` host and DNS.
- Ensure `k8s/deployment.yaml` image placeholder is updated by the workflow; do not manually change it.
- Static site lives in `index.html` and `assets/`.
