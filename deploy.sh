#!/bin/bash

kubectl apply -f kubernetes_config/namespace/namespace.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_secrets.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_client.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_deployment.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_nodeport-svc.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_pv.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_pvc.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_svc.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_pod.yaml
kubectl apply -f kubernetes_config/secrets/tapira-secrets.yaml
kubectl apply -f kubernetes_config/tapira/tapira_pod.yaml
kubectl apply -f kubernetes_config/tapira/tapira_svc.yaml