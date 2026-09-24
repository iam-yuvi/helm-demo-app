# microservices-app

A minimal 3-service app for learning Docker → Kubernetes → Helm.

## Services

| Service           | Port | Purpose                                      | Env Vars                                      |
|-------------------|------|-----------------------------------------------|------------------------------------------------|
| gateway-service   | 3000 | Entry point, calls users + products, aggregates | `PORT`, `USERS_SERVICE_URL`, `PRODUCTS_SERVICE_URL` |
| users-service     | 3001 | Returns in-memory user data                   | `PORT`                                          |
| products-service  | 3002 | Returns in-memory product data                | `PORT`                                          |

## Endpoints

**gateway-service**
- `GET /health`
- `GET /` — aggregates users + products
- `GET /users` — proxies users-service
- `GET /products` — proxies products-service

**users-service**
- `GET /health`
- `GET /users`
- `GET /users/{id}`

**products-service**
- `GET /health`
- `GET /products`
- `GET /products/{id}`

## Building Docker Images

Before running with Docker, Kubernetes, or Helm, you need to build the images for each microservice using the following commands in the root of the project:

```bash
docker build -t gateway-img:latest ./gateway-service
docker build -t users-img:latest ./users-service
docker build -t product-img:latest ./products-service
```

## Deployment Options

This app can be run and deployed in three different ways perfectly suited for learning and production.

### 1. Docker Compose

To spin up the entire application stack using Docker Compose:

```bash
docker-compose up -d
```

The gateway will be accessible at `http://localhost:3000`. You can bring it down elegantly using:

```bash
docker-compose down
```

### 2. Kubernetes using Manifests

Native Kubernetes YAML manifests are provided in the `k8s/` directory.

To deploy all services natively in Kubernetes:

```bash
kubectl apply -f k8s/users-service/
kubectl apply -f k8s/products-service/
kubectl apply -f k8s/gateway-service/
```

Check the status of your deployments and services:

```bash
kubectl get deployments
kubectl get services
```

*Note: The services use `NodePort` allowing you to access them on ports 30000 (gateway), 30001 (users), and 30002 (products).*

### 3. Kubernetes using Helm

A customized Helm chart is located in the `Helm/` directory that configures all instances securely and natively dynamically generating necessary manifests from `values.yaml`.

To deploy via Helm:

```bash
helm install my-microservices ./Helm
```

To upgrade or reconfigure the chart dynamically after making changes to `values.yaml`:

```bash
helm upgrade my-microservices ./Helm
```

To fully wipe the Helm release from the cluster:

```bash
helm uninstall my-microservices
```
