import requests
import json
import time
import datetime
import os
from flask_pymongo import PyMongo
from flask import Flask
from version_parser import Version

##################################################
# Variable Definition
apiclarity_host = os.getenv("api_clarity_host")
apiclarity_port = os.getenv("api_clarity_port")
mongodb_host = os.getenv("mongodb_host")
mongodb_port = os.getenv("mongodb_port")
mongodb_user = os.getenv("MONGODB_USER")
mongodb_password = os.getenv("MONGODB_PASSWORD")
#
###################################################

app = Flask(__name__)

mongodb_client = PyMongo(app, uri="mongodb://%s:%s@%s:%s/api_repo?authSource=admin" % (
mongodb_user, mongodb_password, mongodb_host, mongodb_port))
db = mongodb_client.db


class ApiSpecEntry():
    def __init__(self, name, port, version, api_spec):
        self.name = name
        self.port = port
        self.version = version
        self.apiSpec = api_spec


# If this endpoint is triggered it calls the APIClarity database,
# pull all reconstructed APISpecs and updates the internal API Repository with a the new version.
@app.route("/update")
def update_api_repository():
    # request against APIClarity postgresql db via PostgREST
    response = requests.get('http://%s:%s/api_inventory' % (apiclarity_host, apiclarity_port))
    apiclarity_specs = json.loads(response.content.decode('utf-8'))

    update_counter = 0
    for spec in apiclarity_specs:
        if has_open_api_spec_defined(spec):
            print("Reconstructed OpenAPI Spec was found for %s:%s" % (spec["name"], spec["port"]))
            updated_spec_entry = update_api_spec(spec)
            print("API Spec was updated for %s:%s. New version: %s" % (updated_spec_entry.name,
                                                                       updated_spec_entry.port,
                                                                       updated_spec_entry.version))
            update_counter += 1

    return "%d API Specification(s) %s updated." % (update_counter, ("was" if update_counter == 1 else "were"))


def update_api_spec(apiclarity_spec):
    version = get_new_version_of_api_spec(apiclarity_spec)
    name = apiclarity_spec["name"]
    port = apiclarity_spec["port"]
    api_spec = json.loads(apiclarity_spec["reconstructed_spec"])

    api_spec_entry = ApiSpecEntry(name, port, version, api_spec)
    save_api_spec_entry_to_db(api_spec_entry)
    return api_spec_entry


def has_open_api_spec_defined(apiclarity_spec):
    return apiclarity_spec["reconstructed_spec"] != ""


def save_api_spec_entry_to_db(api_spec_entry):
    created_at_date = datetime.datetime.now()
    # add timestamp to entry
    api_spec_entry.__dict__["createdAt"] = created_at_date
    db.api_specifications.insert_one(api_spec_entry.__dict__)


# calls mongo DB and looks up latest entry of the given api spec and returns the next version number
def get_new_version_of_api_spec(spec):
    matching_entries = db.api_specifications.find({"name": spec["name"], "port": spec["port"]})
    version = Version('0.0.0')

    # TODO: Make version lookup more efficient (e.g. using MongoDB Index?)
    for entry in matching_entries:
        if Version(entry["version"]) > version:
            version = Version(entry["version"])

    # TODO: Consider more semantic versioning, currently only increments the build version
    new_version = '%d.%d.%d' % (
    version.get_major_version(), version.get_minor_version(), (version.get_build_version() + 1))
    return new_version