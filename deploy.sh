#!/bin/bash

kubectl apply -f kubernetes_config/namespace/namespace.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_secrets.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_deployment.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_nodeport-svc.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_pv.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_pvc.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_svc.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_pod.yaml
kubectl apply -f kubernetes_config/tapira
kubectl apply -f kubernetes_config/apiclarity-extended/apiclarity-TAP-service.yaml