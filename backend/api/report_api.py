import json

import requests
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from kubernetes import client, config as kub_config

from backend.models import models
from backend.schema import schema
from backend.services import collection_service as s
from flask import jsonify

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
        print("test")
        kub_config.load_config()

        print("test1")
        v1 = client.CoreV1Api()
        print("Listing pods with their IPs:")
        pods = v1.list_namespaced_pod("sock-shop", watch=False)
        for i in pods.items:
            print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
        print(f'First pod:{pods.items[0]}')

        print("Listing nodes with their IPs:")
        nodes = v1.list_node()
        for i in nodes.items:
            print(f'{i.metadata.annotations}')

        pods = v1.api_client.sanitize_for_serialization(pods)
        nodes = v1.api_client.sanitize_for_serialization(nodes)
        return jsonify({"nodes": nodes, "pods": pods})


