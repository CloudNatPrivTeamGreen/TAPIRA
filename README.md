# TAPIRA: GDPR compliance Tool for **T**ransparent **API**s in **R**ESTful **A**rchitectures

This project serves as a proof of concept for our envisioned evolutionary API Repository in TAPIRA.
It consists of a small backend python application created with flask and a MongoDB database.

The APIRepo application requires that the postgresql database of APIClarity is accessible as a REST API through PostgREST.

The application exposes one REST endpoint `/update` which, if it gets triggered, pulls all reconstructed API specs from APIClarity, labels them with name, port, version and date and stores them in the mongoDB data inside the `api_specifications` collection.
A example API specification entry in the database can be found in the `sample_entry_api_repository.json` file.

# How to run

#  (incase you dont have kubectl) run the following command 
alias kubectl="minikube kubectl --"     
kubectl create namespace sock-shop

kubectl apply -f https://raw.githubusercontent.com/microservices-demo/microservices-demo/master/deploy/kubernetes/complete-demo.yaml

helm repo add apiclarity https://apiclarity.github.io/apiclarity

###for Next command uses values.yml located at startstop branch ( this one its working
# and has the preconfigured TAP functionality and namespace)
# You need to be on the same folder as the values yml 

helm upgrade --values values.yaml --create-namespace apiclarity apiclarity/apiclarity -n apiclarity --install

#Load Test  ( working  added --net=hotst to the structure ) Replace IP with cluster IP  IP
docker run --net=host --rm weaveworksdemos/load-test -d 1 -h 192.168.49.2:30001 -c 300 -r 200

chmod +x ./deploy.sh

#Starts TAPIRA
./deploy.sh
