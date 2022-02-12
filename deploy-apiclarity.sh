#!/bin/bash
helm repo update

helm repo add apiclarity https://apiclarity.github.io/apiclarity

helm upgrade --values values.yaml --create-namespace apiclarity apiclarity/apiclarity -n apiclarity --install