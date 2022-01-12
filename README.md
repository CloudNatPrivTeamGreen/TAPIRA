# APIEvoRepo
 
This project serves as a proof of concept for our envisioned evolutionary API Repository in TAPIRA.
It consists of a small backend python application created with flask and a MongoDB database.

The APIRepo application requires that the postgresql database of APIClarity is accessible as a REST API through PostgREST.

The application exposes one REST endpoint `/update` which, if it gets triggered, pulls all reconstructed API specs from APIClarity, labels them with name, port, version and date and stores them in the mongoDB data inside the `api_specifications` collection.
A example API specification entry in the database can be found in the `sample_entry_api_repository.json` file.

# How to run

#### 1. Setup PostgREST
  * https://www.notion.so/6d4e7f70bec14dfeba63360821a41ac8?v=0367dd24f9fe4b0e8b655e503a852bd8&p=4f88ec58ff554586afa06ab039888a7b

#### 2. Create MongoDB instace with docker-compose
  ```
  docker-compose up -d
  ```

#### 3. Install Flask
 * https://flask.palletsprojects.com/en/2.0.x/installation/

#### 4. If necessary, edit the credential variables, which can be found at the top in the first few lines of the `apirepo.py` file. They are necessary to connect to the MongoDB and to PostgREST.
```
apiclarity_host='localhost'
apiclarity_port='3000'
mongodb_host='localhost'
mongodb_port='27017'
mongodb_user='root'
mongodb_password='rootpassword'
```

#### 5. Execute the following commands:
    $ export FLASK_APP=apirepo.py
    $ flask run

#### 6. The application is now runinning under http://localhost:3000/

#### 7. Generate traffic in your application and review the API specifactions inside APIClarity to generate reconstructed API specifactions.

#### 8. If you now trigger http://localhost:3000/update APIRepo will fetch all reconstructed API specs and save them in the DB. If it finds previous definitons of the API specifaction it will increment the version number.


