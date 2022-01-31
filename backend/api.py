import json
import time

import requests
from flask import request, Response
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend import config as config
from backend import models as models
from backend.schema import schema
from backend.services import collection_service as s

##################################################
# Variable Definition
blp = Blueprint("specs",
                "specs",
                url_prefix="/api",
                description="Collection and maintenance of specifications"
                )


@blp.route("/time")
@blp.route("/")
class TestConnection(MethodView):
    def get(self):
        return {'time': time.time()}


@blp.route("/housekeeping")
class ClearReconstructed(MethodView):
    @blp.response(200, schema.HousekeepingSchema)
    def get(self):
        return {"status_of_deletion": s.delete_all_reconstructed_specs()}


@blp.route("/apiclarity_specs")
class ApiClaritySpecs(MethodView):
    @blp.response(200, schema.ApiClaritySpecsSchema)
    def get(self):
        """Fetch provided and reconstructed specifications from APIClarity and save them in database.
        ---
        """
        response = requests.get(f'{config.APICLARITY_URL}/api_inventory')
        apiclarity_specs = json.loads(response.content.decode('utf-8'))
        new_provided_services = []
        new_reconstructed_services = []
        s.extract_api_specs(apiclarity_specs, new_provided_services, new_reconstructed_services)

        return {"updated_provided_services": new_provided_services,
                "updated_reconstructed_services": new_reconstructed_services}


@blp.route("/services")
class Services(MethodView):
    @blp.response(200, schema.ServicesSchema)
    def get(self):
        """Get list of service names

        Return list of unique service names with existing specifications.
        ---
        """
        return {"services": s.get_service_names_with_specs()}


@blp.route("/specifications")
class Specifications(MethodView):
    @blp.arguments(schema.QueryParamsSchema, location="query")
    @blp.response(200, schema.ApiSpecsSchema)
    def get(self, args):
        """Get filtered api specifications

        Filter api specifications based on parameters.
        ---
        """
        service = request.args.get("service")
        spec_type = request.args.get("type")
        version = request.args.get("version")

        if service is None:
            abort(400, "Service name missing from the parameters")
        elif version is not None and not s.is_valid_version(version):
            abort(400, f'Please provide version in format:{s.version_pattern_string}')

        api_specs = models.ApiSpecs(s.get_specifications_by_params(service, version, spec_type))
        return schema.ApiSpecsSchema().dump(api_specs)


@blp.route("/current_version_spec")
class CurrentVersionSpec(MethodView):
    @blp.arguments(schema.CurrentApiRequestSchema, location="query")
    @blp.response(200, schema.ApiSpecEntrySchema)
    def get(self, args):
        """Get most recent api specification

        Get most recent api specification based on service name.
        ---
        """
        service = request.args.get("service")

        if service is None:
            abort(400, "Service name missing from the parameters")

        recent_spec = s.get_latest_previous_provided(service)
        if recent_spec is None:
            abort(404, message=f"No spec found for service={service}")

        return schema.ApiSpecEntrySchema().dump(recent_spec)


@blp.route("/conflicts")
class ApiConflicts:
    def get(self, args):
        return {"api_conflicts": []}


@blp.route("/upload")
class Upload:
    def upload_api_spec(self, args):
        return Response("{'id': 'test_uploaded_id'}", status=200, mimetype="application/json")
