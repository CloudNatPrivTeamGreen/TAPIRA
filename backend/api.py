import json
import os

import requests
from flask import request, Response

from backend import app
from backend import models as models
from backend import openapi_config as config
from backend.services import collection_service as s

##################################################
# Variable Definition
APICLARITY_HOST = os.getenv("api_clarity_host", default="localhost")
APICLARITY_PORT = os.getenv("api_clarity_port", default=9998)
APICLARITY_URL = f'http://{APICLARITY_HOST}:{APICLARITY_PORT}'


# If this endpoint is triggered it calls the APIClarity database,
# pull all reconstructed APISpecs and updates the internal API Repository with a the new version.
@app.route("/api/update", methods=["GET"])
def update_api_repository():
    # request against APIClarity postgresql db via PostgREST
    response = requests.get(f'{APICLARITY_URL}/api_inventory')
    apiclarity_specs = json.loads(response.content.decode('utf-8'))

    new_provided_services = []
    new_reconstructed_services = []
    s.extract_api_specs(apiclarity_specs, new_provided_services, new_reconstructed_services)

    return {"updated_provided_services": new_provided_services,
            "updated_reconstructed_services": new_reconstructed_services}


@app.route("/api/services", methods=["GET"])
def get_list_services():
    return {"services": s.get_service_names_with_specs()}


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
    spec_type = request.args.get("type")
    version = request.args.get("version")

    api_specs = models.ApiSpecs(s.get_specifications_by_params(service, version, spec_type))
    return config.ApiSpecsSchema().dump(api_specs)


@app.route("/api/current_version_spec", methods=["GET"])
def get_current_version_spec():
    service = request.args.get("service")
    return {"recent_api_spec": s.get_latest_previous_provided(service), "service_name": service}


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