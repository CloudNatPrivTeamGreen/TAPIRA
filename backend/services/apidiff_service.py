import json

import humps
import requests

from backend import config
from backend.schema.schema import ApiDiffsResponseSchema, ApiDiffTiraSchema
from backend.services import collection_service
from flask_smorest import abort


def get_all_diffs_for_two_versions(service_name, old_version, new_version):
    old_spec = collection_service.get_single_spec_by_name_and_version(service_name, old_version)
    new_spec = collection_service.get_single_spec_by_name_and_version(service_name, new_version)

    if old_spec is None:
        abort(400, message=f'Spec missing for service:{service_name} and version:{old_version}')
    elif new_spec is None:
        abort(400, message=f'Spec missing for service:{service_name} and version:{new_version}')

    api_diffs = get_api_diffs(old_spec["api_spec"], new_spec["api_spec"])
    tira_diffs = get_tira_changes(old_spec["api_spec"], new_spec["api_spec"])

    return {"service": service_name, "api_diffs": api_diffs, "tira_diffs": tira_diffs}


def get_conflicts_between_reconstructed_and_current(service_name):
    current_spec = collection_service.get_latest_spec(service_name)
    reconstructed_spec = collection_service.get_proposal(service_name)

    if current_spec is None:
        abort(400, message=f'Latest spec missing for service:{service_name}')
    elif reconstructed_spec is None:
        abort(400, message=f'Reconstructed spec missing for service:{service_name}')

    return {"api_diffs": get_api_diffs(current_spec.api_spec, reconstructed_spec)}


def get_api_diffs(first_spec, second_spec):
    response = requests.get(url=f'{config.APIDIFF_URL}/apidiff/relevantChanges',
                            json={"oldApiSpec": first_spec,
                                  "newApiSpec": second_spec})

    response_body_decamelized = humps.decamelize(response.json())
    return ApiDiffsResponseSchema().loads(json.dumps(response_body_decamelized))


def get_tira_changes(first_spec, second_spec):
    response = requests.get(url=f'{config.APIDIFF_URL}/apidiff/tira',
                            json={"oldApiSpec": first_spec,
                                  "newApiSpec": second_spec})
    response_body_decamelized = humps.decamelize(response.json())
    return ApiDiffTiraSchema().loads(json.dumps(response_body_decamelized))


def is_empty(list_changes: []):
    return list_changes is None or len(list_changes) == 0
