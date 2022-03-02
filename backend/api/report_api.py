from flask import request, jsonify
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.schema import schema
from backend.services import report_service
# from backend.services import collection_service as s
# from backend.services import conflicts_service

blp = Blueprint("report_api",
                "report_api",
                url_prefix="/api",
                description="Creation and Managing of Reports"
                )


@blp.route("/report")
class Report(MethodView):
    @blp.arguments(schema.ReportByTimestampPairRequestBody, location="json")
    @blp.response(200, schema.ReportSchema)
    def get(self, request_body):
        """Get the report associated with the given timestamp pair

        ---
        """
        start = request_body.get("start_timestamp")
        end = request_body.get("end_timestamp")
        return report_service.get_report_by_timestamps(start, end)

    @blp.arguments(schema.ReportByTimestampPairRequestBody, location="json")
    @blp.response(200, schema.ReportSchema)
    def post(self, request_body):
        """Initialize report creation for the given timestamp pair.

        Returns the created report, which was saved to the DB.
        ---
        """
        start = request_body.get("start_timestamp")
        end = request_body.get("end_timestamp")
        return report_service.create_report_with_timestamps(start, end)

    @blp.arguments(schema.ReportByTimestampPairRequestBody, location="json")
    @blp.response(200)
    def delete(self, request_body):
        """Deletes the report associated with the given timestamp pair

        ---
        """
        start = request_body.get("start_timestamp")
        end = request_body.get("end_timestamp")
        return report_service.delete_report_by_timestamps(start, end)

@blp.route("/report/all")
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

@blp.route("/report/test")
class Test(MethodView):
    @blp.response(200)
    def get(self):
        return report_service.test()