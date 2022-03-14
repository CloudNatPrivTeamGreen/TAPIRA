from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint
from kubernetes import client
from kubernetes import config as kub_config

from backend import config
from backend.schema import schema
from backend.schema.schema import RecordStatusEnum
from backend.services import report_service

##################################################
# Variable Definition
blp = Blueprint("report_api",
                "report_api",
                url_prefix="/api",
                description="Collection and maintenance of specifications"
                )

kub_config.load_incluster_config()
core_api = client.CoreV1Api(client.ApiClient())
apps_api = client.AppsV1Api(client.ApiClient())


@blp.route("/recording")
class ApiServerTest(MethodView):

    @blp.arguments(schema.RecordStatus, location="query")
    def post(self, query_params):
        """Scale ApiClarity up or down and generate a report
        ---
        """

        record_status = query_params["record_status"]
        if record_status == RecordStatusEnum.ON:
            apps_api.patch_namespaced_deployment_scale("apiclarity-apiclarity", "apiclarity", {"spec": {"replicas": 1}})
            report_service.create_report_start_record()
        else:
            report_service.generate_report()
            apps_api.patch_namespaced_deployment_scale("apiclarity-apiclarity", "apiclarity", {"spec": {"replicas": 0}})

        return {"record_status": str(record_status)}


@blp.route("/reports")
class AllReports(MethodView):
    @blp.response(200, schema.AllReportsSchema)
    def get(self):
        """Get all reports

        Returns a list of all reports.
        ---
        """
        return schema.AllReportsSchema().dump(
            {
                "reports": report_service.get_all_reports()
            }
        )

    def delete(self):
        """ Delete all reports
        """

        return report_service.delete_all_reports()


@blp.route("/api_server")
class ApiServerTest(MethodView):
    def get(self):
        """Fetch provided and reconstructed specifications from APIClarity and save them in database.
        ---
        """
        print("Listing pods with their IPs:")
        pods = core_api.list_namespaced_pod("sock-shop", watch=False)
        for i in pods.items:
            print("%s\t%s\t%s" % (i.status.pod_ip, i.metadata.namespace, i.metadata.name))
        print(f'First pod:{pods.items[0]}')

        print("Listing nodes with their IPs:")
        nodes = core_api.list_node()
        for i in nodes.items:
            print(f'{i.metadata.annotations}')

        pods = core_api.api_client.sanitize_for_serialization(pods)
        nodes = core_api.api_client.sanitize_for_serialization(nodes)
        return jsonify({"nodes": nodes, "pods": pods})
