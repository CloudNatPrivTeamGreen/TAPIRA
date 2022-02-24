import json

import requests
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from kubernetes import client, config as kub_config

from backend.models import models
from backend.schema import schema
from backend.services import collection_service as s

##################################################
# Variable Definition
blp = Blueprint("report_api",
                "report_api",
                url_prefix="/api",
                description="Collection and maintenance of specifications"
                )

@blp.route("/api_server")
class ApiServerTest(MethodView):
    def get(self):
        """Fetch provided and reconstructed specifications from APIClarity and save them in database.
        ---
        """
        kub_config.load_incluster_config()

        v1 = client.CoreV1Api()
        print("Listing pods with their IPs:")
        ret = v1.list_pod_for_all_namespaces(watch=False)
        for i in ret.items:
            print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))

        return {"pods": ret}


