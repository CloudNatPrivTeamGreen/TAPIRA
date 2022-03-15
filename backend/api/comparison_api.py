from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend.schema import schema
from backend.services import apidiff_service as diff_service
from backend.services import comparison_service as s
from backend.services import get_single_spec_by_name_and_version as get_spec
from backend.utils import get_schema_path, get_tira_changes, merge_path_entries

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
    @blp.response(200, schema.TiraChangesComparisonSchema)
    def get(self, query_params):
        """Compare api and tira diffs between two version of specifications for a service.

        Compare api and tira diffs between two version of specifications for a service.
        ---
        """
        service_name = query_params["service"]
        old_version = query_params["old_version"]
        new_version = query_params["new_version"]
        changes = schema.AllChangesComparisonSchema().dump(
            diff_service.get_all_diffs_for_two_versions(service_name, old_version, new_version))

        response = {}

        # schema TIRA changes
        changed_schema_json = {}
        for entry in changes["tira_diffs"]["changed_schema_tira_annotations"]:
            changed_schema_json[entry["schemaName"]] = get_tira_changes(entry, type="schema_changed")

        missing_schema_json = {}
        for entry in changes["tira_diffs"]["missing_schema_tira_annotations"]:
            missing_schema_json[entry["schemaName"]] = get_tira_changes(entry["schemaTiraAnnotation"], type="missing")
        
        new_schema_json = {}
        for entry in changes["tira_diffs"]["new_schema_tira_annotations"]:
            new_schema_json[entry["schemaName"]] = get_tira_changes(entry["schemaTiraAnnotation"], type="new")

        response["schemas"] = {"changed": changed_schema_json, "missing": missing_schema_json, "new": new_schema_json}

        # global TIRA changes
        entries = {"oldGlobalTiraAnnotation": 
                    {obj["key"]: obj["oldGlobalTiraAnnotation"] for obj in changes["tira_diffs"]["changed_global_tira_annotations"]},
                   "newGlobalTiraAnnotation":
                    {obj["key"]: obj["newGlobalTiraAnnotation"] for obj in changes["tira_diffs"]["changed_global_tira_annotations"]}}
        changed_global_json = get_tira_changes(entries, type="global_changed")

        entries = {k: v for global_obj in changes["tira_diffs"]["missing_global_tira_annotations"] for k, v in global_obj.items()}
        missing_global_json = get_tira_changes(entries, type="missing")
        
        entries = {k: v for global_obj in changes["tira_diffs"]["new_global_tira_annotations"] for k, v in global_obj.items()}
        new_global_json = get_tira_changes(entries, type="new")

        response["global"] = {"changed": changed_global_json, "missing": missing_global_json, "new": new_global_json}

        # paths of schema TIRA changes
        paths = []
        new_and_changed_schemas = list(changed_schema_json.keys()) + list(new_schema_json.keys())
        new_spec = get_spec(service_name, new_version)["api_spec"]
        old_spec = get_spec(service_name, old_version)["api_spec"]
        for entry in new_and_changed_schemas:
            paths.append(get_schema_path(entry, new_spec["paths"]))
        for entry in list(missing_schema_json.keys()):
            paths.append(get_schema_path(entry, new_spec["paths"], old_spec["paths"], missing=True))
        response["paths"] = merge_path_entries(paths)
        return response

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
