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

@blp.route("/apiclarity_specs")
class ApiClaritySpecs(MethodView):
    @blp.response(200, schema.ApiClaritySpecsSchema)
    def get(self):
        """Fetch provided and reconstructed specifications from APIClarity and save them in database.
        ---
        """
        response = requests.get(f'{config.APICLARITY_URL}/api_inventory')
        apiclarity_specs = json.loads(response.content.decode('utf-8'))
        reconstructed_services = []
        s.extract_api_specs(apiclarity_specs, reconstructed_services)

        return {"reconstructed_services": reconstructed_services}


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
        version = request.args.get("version")

        if service is None:
            abort(400, "Service name missing from the parameters")
        elif version is not None and not s.is_valid_version(version):
            abort(400, f'Please provide version in format:{s.version_pattern_string}')

        api_specs = models.ApiSpecs(s.get_specifications_by_params(service, version))
        return schema.ApiSpecsSchema().dump(api_specs)


@blp.route("/current_version_spec")
class CurrentVersionSpec(MethodView):
    @blp.arguments(schema.ServiceNameParameterSchema, location="query")
    @blp.response(200, schema.ApiSpecEntrySchema)
    def get(self, args):
        """Get latest api specification

        Get latest api specification based on service name.
        ---
        """
        service = request.args.get("service")

        if service is None:
            abort(400, "Service name missing from the parameters")

        recent_spec = s.get_latest_spec(service)
        if recent_spec is None:
            abort(404, message=f"No spec found for service={service}")

        return schema.ApiSpecEntrySchema().dump(recent_spec)


@blp.route("/upload")
class Upload(MethodView):

    @blp.arguments(schema.UploadSchema, location='files')
    @blp.arguments(schema.ServiceNameParameterSchema, location="query")
    @blp.response(200, schema.UploadResponseSchema)
    def post(self, file_body, query_params):
        """Upload existing API specification

        Upload existing API specification and delete current proposals for the same service.
        ---
        """
        file = file_body['file']
        service = query_params['service']

        if file.filename == '':
            abort(400, "Empty filename")
        elif service is None:
            abort(400, "Service name missing from the parameters")

        created_version = s.insert_provided_spec(file, service)
        return {"created_version": created_version}
