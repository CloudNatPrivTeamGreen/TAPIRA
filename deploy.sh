#!/bin/bash

kubectl apply -f kubernetes_config/namespace/namespace.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_config.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_svc.yaml
kubectl apply -f kubernetes_config/tapira_db/mongodb_pod.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_svc.yaml
kubectl apply -f kubernetes_config/postgrest/postgrest_pod.yaml
kubectl apply -f kubernetes_config/secrets/tapira-secrets.yaml
kubectl apply -f kubernetes_config/tapira/tapira_pod.yaml
kubectl apply -f kubernetes_config/tapira/tapira_svc.yaml
kubectl apply -f kubernetes_config/apiclarity-extended.yaml