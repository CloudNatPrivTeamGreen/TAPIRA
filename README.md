# TAPIRA: GDPR compliance Tool for **T**ransparent **API**s in **R**ESTful **A**rchitectures

This project serves as a proof of concept for our envisioned evolutionary API Repository in TAPIRA.
It consists of a small backend python application created with flask and a MongoDB database.

The APIRepo application requires that the postgresql database of APIClarity is accessible as a REST API through PostgREST.

The application exposes one REST endpoint `/update` which, if it gets triggered, pulls all reconstructed API specs from APIClarity, labels them with name, port, version and date and stores them in the mongoDB data inside the `api_specifications` collection.
A example API specification entry in the database can be found in the `sample_entry_api_repository.json` file.

# How to run

#### 1. Setup PostgREST

- https://www.notion.so/6d4e7f70bec14dfeba63360821a41ac8?v=0367dd24f9fe4b0e8b655e503a852bd8&p=4f88ec58ff554586afa06ab039888a7b

#### 2. Create MongoDB instace with docker-compose

```bash
docker-compose up -d
```

#### 3. Set up a virtual environment for python applications and install the project dependencies via the provided requirements.txt or Pipfile.

Install "pipenv" if not installed with the following command

```bash
  pip install pipenv
```

Change the current directory to the root directory of Tapira and then execute

```bash
  pipenv shell
```

This will spin up a virtual environment for you. After that execute the following:

```bash
  pipenv install
```

This will install all the dependencies for the backend project.
Inorder to install any other dependencies execute the following

```bash
  pipenv install <package-name>
  pipenv lock -r > requirements.txt
```
The above commands will install the required package, add it to the Pipfile and as well as add to the requirements.txt file.
#### 4. Entering and exiting the virtual environment.

In order to exit from the virtual environment either do ctrl+d or

```bash
  exit
```

in your command line. To spin up the virtual environment again execute
```bash
  pipenv shell
```
in the folder where Pipfile is located.

#### 5. If necessary, edit the credential variables, which can be found at the top in the first few lines of the `apirepo.py` file. They are necessary to connect to the MongoDB and to PostgREST.

```
apiclarity_host='localhost'
apiclarity_port='3000'
mongodb_host='localhost'
mongodb_port='27017'
mongodb_user='root'
mongodb_password='rootpassword'
```

#### 6. Execute the following commands:

Execute the following to start the backend `flask run` in the folder where tapira.py is located.

#### 7. The application is now runinning under http://localhost:5000/

#### 8. Generate traffic in your application and review the API specifactions inside APIClarity to generate reconstructed API specifactions.

#### 9. If you now trigger http://localhost:3000/update APIRepo will fetch all reconstructed API specs and save them in the DB. If it finds previous definitons of the API specifaction it will increment the version number.

##### 10. There is a Dockerfile, which is used to build the docker image.

Here you can see two entries of the user API after 2 calls to the `/update`.
![Screenshot from 2022-01-12 19-39-20](https://user-images.githubusercontent.com/58170155/149201767-482adb6d-357d-45c4-8287-c1e658c18260.png)

#### Deploy in Kubernetes:

    chmod +x deploy.sh
    ./deploy.sh
