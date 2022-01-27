import json
import os

import requests
from flask import request, Response
from flask_pymongo import PyMongo
from version_parser import Version

from backend import app
from backend import models as models
from backend import openapi_config as config

##################################################
# Variable Definition
apiclarity_host = os.getenv("api_clarity_host")
apiclarity_port = os.getenv("api_clarity_port")
mongodb_host = os.getenv("mongodb_host")
mongodb_port = os.getenv("mongodb_port")
mongodb_user = os.getenv("MONGODB_USER")
mongodb_password = os.getenv("MONGODB_PASSWORD")
# #
###################################################

mongodb_client = PyMongo(app, uri="mongodb://%s:%s@%s:%s/api_repo?authSource=admin" % (
    mongodb_user, mongodb_password, mongodb_host, mongodb_port))
db = mongodb_client.db


# If this endpoint is triggered it calls the APIClarity database,
# pull all reconstructed APISpecs and updates the internal API Repository with a the new version.
@app.route("/api/update", methods=["GET"])
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


@app.route("/api/services", methods=["GET"])
def get_list_services():
    # return {"services": ["user", "catalogue", "payment", "orders", "carts", "shipping"]}
    return {"services": db.api_specifications.find().distinct('name')}


@app.route("/api/specifications", methods=["GET"])
def get_specifications_by_service():
    """Get filtered api specifications.
    ---
    get:
      parameters:
      - in: path
        schema: QueryParamsSchema
      responses:
        200:
          content:
            application/json:
              schema: ApiSpecsSchema
    """
    service = request.args.get("service")
    api_spec_type = request.args.get("type")
    version = request.args.get("version")

    api_specs = models.ApiSpecs(list(db.api_specifications.find({"name": service})))

    return config.ApiSpecsSchema().dump(api_specs)


@app.route("/api/current_version_spec", methods=["GET"])
def get_current_version_spec():
    service = request.args.get("service")
    return {"recent_api_specification": [], "service": service}


@app.route("/api/conflicts", methods=["GET"])
def get_api_conflicts():
    return {"api_conflicts": []}


@app.route("/api/upload", methods=["POST"])
def upload_api_spec():
    return Response("{'id': 'test_uploaded_id'}", status=200, mimetype="application/json")


# Since path inspects the view and its route,
# we need to be in a Flask request context
with app.test_request_context():
    config.spec.path(view=get_list_services) \
        .path(view=get_specifications_by_service) \
        .path(view=get_current_version_spec) \
        .path(view=get_api_conflicts) \
        .path(view=upload_api_spec)

# We're good to go! Save this to a file for now.
with open('openapi.json', 'w') as f:
    json.dump(config.spec.to_dict(), f)


def update_api_spec(apiclarity_spec):
    version = get_new_version_of_api_spec(apiclarity_spec)
    name = apiclarity_spec["name"]
    port = apiclarity_spec["port"]
    api_spec = json.loads(apiclarity_spec["reconstructed_spec"])

    api_spec_entry = models.ApiSpecEntry(name, port, version, api_spec)
    save_api_spec_entry_to_db(api_spec_entry)
    return api_spec_entry


def has_open_api_spec_defined(apiclarity_spec):
    return apiclarity_spec["reconstructed_spec"] != ""


def save_api_spec_entry_to_db(api_spec_entry):
    db.api_specifications.insert_one(api_spec_entry.__dict__)


# calls mongo DB and looks up latest entry of the given api spec and returns the next version number
def get_new_version_of_api_spec(api_spec):
    matching_entries = db.api_specifications.find({"name": api_spec["name"], "port": api_spec["port"]})
    version = Version('0.0.0')

    # TODO: Make version lookup more efficient (e.g. using MongoDB Index?)
    for entry in matching_entries:
        if Version(entry["version"]) > version:
            version = Version(entry["version"])

    # TODO: Consider more semantic versioning, currently only increments the build version
    new_version = '%d.%d.%d' % (
        version.get_major_version(), version.get_minor_version(), (version.get_build_version() + 1))
    return new_version
