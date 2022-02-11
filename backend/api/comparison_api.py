from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.schema import schema
from backend.services import comparison_service as s


blp = Blueprint("comparison_api",
                "comparison_api",
                url_prefix="/api",
                description="Comparing a api specification of a service to the latest spec and providing the changes."
                )


@blp.route("/comparison")
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