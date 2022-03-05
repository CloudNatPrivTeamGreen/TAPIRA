import json

from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.api import presentation_cases
from backend.schema import schema
from backend.services import comparison_service as s
from backend.services import apidiff_service as diff_service

blp = Blueprint("comparison_api",
                "comparison_api",
                url_prefix="/api",
                description="Comparing a api specification of a service to the latest spec and providing the changes."
                )


@blp.route("/comparison")
class Upload(MethodView):

    @blp.arguments(schema.UploadSchema, location='files')
    @blp.arguments(schema.ComparisonParameterSchema, location="query")
    @blp.response(200, schema.AllChangesComparisonSchema)
    def post(self, file_body, query_params):
        """Upload existing API specification

        Upload existing API specification and delete current proposals for the same service.
        ---
        """
        file = file_body['file']
        service = query_params['service']

        if file.filename == '':
            abort(400, message="Empty filename")
        elif service is None:
            abort(400, message="Service name missing from the parameters")

        comparison = s.get_comparison_with_latest_spec(file, service)
        return schema.AllChangesComparisonSchema().dump(comparison)


@blp.route("/evolution")
class Comparison(MethodView):

    @blp.arguments(schema.EvolutionQueryParamsSchema, location="query")
    @blp.response(200, schema.AllChangesComparisonSchema)
    def get(self, query_params):
        """Compare api and tira diffs between two version of specifications for a service.

        Compare api and tira diffs between two version of specifications for a service.
        ---
        """
        service_name = query_params["service"]
        old_version = query_params["old_version"]
        new_version = query_params["new_version"]
        return schema.AllChangesComparisonSchema().dump(
            diff_service.get_all_diffs_for_two_versions(service_name, old_version, new_version))


@blp.route("/evolution_test")
class ComparisonTest(MethodView):

    @blp.arguments(schema.EvolutionQueryParamsSchema, location="query")
    def get(self, query_params):
        """Compare api and tira diffs between two version of specifications for a service.

        Compare api and tira diffs between two version of specifications for a service.
        ---
        """
        service_name = query_params["service"]
        old_version = query_params["old_version"]
        new_version = query_params["new_version"]

        return presentation_cases.evolution[f'{service_name}_{old_version}_{new_version}']


@blp.route("/report_test")
class ReportTest(MethodView):

    def get(self):
        """Compare api and tira diffs between two version of specifications for a service.

        Compare api and tira diffs between two version of specifications for a service.
        ---
        """

        return {"reports": presentation_cases.reports}
