# TAPIRA: GDPR compliance Tool for **T**ransparent **API**s in **R**ESTful **A**rchitectures

This project serves as a proof of concept for our envisioned evolutionary API Repository in TAPIRA.
It consists of a small backend python application created with flask and a MongoDB database.

The APIRepo application requires that the postgresql database of APIClarity is accessible as a REST API through PostgREST.

The application exposes one REST endpoint `/update` which, if it gets triggered, pulls all reconstructed API specs from APIClarity, labels them with name, port, version and date and stores them in the mongoDB data inside the `api_specifications` collection.
A example API specification entry in the database can be found in the `sample_entry_api_repository.json` file.

# Setup Instructions
##  In case you dont have kubectl, run the following command 
```bash
alias kubectl="minikube kubectl --"     
kubectl create namespace sock-shop
```

## Instantiate sock-shop demo and add APIClarity repo to `helm`
```bash
kubectl apply -f https://raw.githubusercontent.com/microservices-demo/microservices-demo/master/deploy/kubernetes/complete-demo.yaml
helm repo add apiclarity https://apiclarity.github.io/apiclarity
```

## Locate `values.yml` in the TAPIRA directory and upgrade `helm`
```bash
helm upgrade --values values.yaml --create-namespace apiclarity apiclarity/apiclarity -n apiclarity --install
```

## (Optional) Load Testing
```bash
# Replace [IP] with cluster IP  IP
docker run --net=host --rm weaveworksdemos/load-test -d 1 -h [IP]:30001 -c 300 -r 200
```

## Enable and execute the deployment script
```bash
chmod +x ./deploy.sh
./deploy.sh
```
