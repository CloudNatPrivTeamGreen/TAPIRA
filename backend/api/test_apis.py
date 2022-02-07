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
test_blp = Blueprint("testing",
                     "testing",
                     url_prefix="/test",
                     description="Endpoints for easier testing"
                     )


@test_blp.route("/housekeeping_specs")
class ClearReconstructed(MethodView):
    @test_blp.arguments(schema.ServiceNameParameterSchema, location="query")
    @test_blp.response(200, schema.HousekeepingSchema)
    def delete(self, query_params):
        """Delete all api specifications

        Delete all api specifications
        ---
        """

        service = query_params['service']
        if service is None:
            abort(400, "Service name missing from the parameters")
        return {"number_of_deleted": s.delete_all_specs(service)}


@test_blp.route("/time")
@test_blp.route("/")
class TestConnection(MethodView):
    def get(self):
        return {'time': time.time()}

    def post(self):
        return {'time': time.time()}