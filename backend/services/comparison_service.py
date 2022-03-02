import json
from backend.services import collection_service as c_s
from backend.services import apidiff_service as a_s


def get_comparison_with_latest_spec(spec_file, service):
    comparison_spec = json.loads(spec_file.read())
    latest_spec = c_s.get_latest_spec(service)

    latest_api_spec = {} if latest_spec is None else latest_spec.api_spec

    comparison = a_s.get_all_diffs_for_two_openapi_specs(service, latest_api_spec, comparison_spec)
    print(comparison)
    return comparison

