from backend.models.models import ApiDiffs
from backend.repository import api_spec_proposals_repo as proposal_repo
from backend.services import collection_service, apidiff_service


def get_all_reconstructed_and_create_conflicts():
    service_name_proposals = collection_service.get_service_names_with_proposals()
    proposal_repo.delete_all_conflicts()

    services_with_conflicts = []
    for i in range(len(service_name_proposals)):
        proposal = collection_service.get_proposal(service_name_proposals[i])
        current_version_spec_entry = collection_service.get_latest_spec(service_name_proposals[i])

        is_conflict = get_api_diffs_and_create_conflict(service_name_proposals[i], current_version_spec_entry, proposal)

        if is_conflict:
            services_with_conflicts.append(service_name_proposals[i])

    return services_with_conflicts


def get_api_diffs_and_create_conflict(service_name, current_version_spec_entry, proposal):
    current_version = {} if current_version_spec_entry is None else current_version_spec_entry.api_spec

    diffs: ApiDiffs = apidiff_service.get_api_diffs(current_version, proposal)
    if not is_empty(diffs.changed_operations) or not is_empty(
            diffs.missing_endpoints) or not is_empty(diffs.new_endpoints):
        proposal_repo.insert_conflict(service_name, diffs)
        return True

    return False


def get_conflict(service_name):
    return proposal_repo.find_conflict(service_name)


def is_empty(list_changes: []):
    return list_changes is None or len(list_changes) == 0
