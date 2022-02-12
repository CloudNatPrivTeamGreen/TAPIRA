from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.schema import schema
from backend.services import merge_service as s

blp = Blueprint("merge_api",
                "merge_api",
                url_prefix="/api",
                description="Providing a proposed merge of two provided API specification in given context."
                )

@blp.route("/proposed_merge")
class Test4(MethodView):
    @blp.arguments(schema.ProposedMergeParameterSchema, location="query")
    @blp.arguments(schema.ProposedMergeRequestBodySchema, location="json")
    @blp.response(200, schema.ProposedMergeResponseSchema)
    def get(self, args, request_body):
        """Get a proposed merge of both api specifications

        Get a proposed merge of both api specifications in the context of validation or comparison.
        ---
        """
        context = args.get("context")

        old_api = request_body.get("old_api")
        new_api = request_body.get("new_api")

        if context == "validation":
            return {"proposed_merge": s.get_proposed_merge_for_validation(old_api, new_api)}
        elif context == "comparison":
            return {"proposed_merge": s.get_proposed_merge_for_comparison(old_api, new_api)}
        else:
            abort(400, message = "Invalid context")