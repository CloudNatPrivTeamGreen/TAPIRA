from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.schema import schema
from backend.services import collection_service as s
from backend.services import conflicts_service

blp = Blueprint("proposals_api",
                "proposals_api",
                url_prefix="/api",
                description="Collection and maintenance of spec proposals"
                )


@blp.route("/service_proposals")
class Services(MethodView):
    @blp.response(200, schema.ServicesSchema)
    def get(self):
        """Get list of service names

        Return list of unique service names with existing proposals for specifications.
        ---
        """
        return {"services": s.get_service_names_with_proposals()}


@blp.route("/proposal")
class Proposal(MethodView):
    @blp.arguments(schema.ServiceNameParameterSchema, location="query")
    @blp.response(200, schema.ProposalSchema)
    def get(self, args):
        """Get proposal for a service

        Get proposal by a service name.
        ---
        """
        service = request.args.get("service")

        if service is None:
            abort(400, "Service name missing from the parameters")

        return {"proposal": s.get_proposal(service)}


@blp.route("/housekeeping")
class ClearReconstructed(MethodView):
    @blp.response(200, schema.HousekeepingSchema)
    def delete(self):
        """Delete all proposals

        Delete all proposals
        ---
        """
        return {"number_of_deleted": s.delete_all_proposals()}


@blp.route("/conflicts")
class ServiceConflicts(MethodView):

    @blp.response(200, schema.ServicesSchema)
    def post(self):
        """Returns list of services with conflicts

        Returns list of services with conflicts. If none provided specs compare with empty.
        ---
        """
        return {"services": conflicts_service.get_all_reconstructed_and_create_conflicts()}


@blp.route("/conflict")
class ApiDiffsRoute(MethodView):

    @blp.arguments(schema.ServiceNameParameterSchema, location="query")
    @blp.response(200, schema.AllChangesComparisonSchema)
    def get(self, query_params):
        """Finds conflicts between reconstructed and latest spec

        Finds conflicts between reconstructed and latest spec by using the ApiDiff service.
        ---
        """
        service = query_params["service"]
        return schema.AllChangesComparisonSchema().dump(
            {"service": service, "tira_diffs": None, "api_diffs": conflicts_service.get_conflict(service)})
