import json
import re

from version_parser import Version

from backend.models.models import ApiSpecEntry
from backend.repository import api_spec_repo as spec_repo
from backend.repository import api_spec_proposals_repo as proposal_repo
from backend.utils import is_not_empty, is_empty

version_pattern_string = "<<x.x.x>>"
version_pattern = re.compile("[0-9]+\\.[0-9]+\\.[0-9]+$")

version_snapshot_string = "<<x.x.x-SNAPSHOT>>"
version_snapshot_pattern = re.compile("[0-9]+\\.[0-9]+\\.[0-9]+-SNAPSHOT$")


def has_provided_spec(spec_wrapper):
    return spec_wrapper["has_provided_spec"]


def has_reconstructed_spec(spec_wrapper):
    return spec_wrapper["has_reconstructed_spec"]


def get_provided_spec(spec_wrapper):
    return spec_wrapper["provided_spec"]


def get_reconstructed_spec(spec_wrapper):
    return spec_wrapper["reconstructed_spec"]


def get_api_spec_version(api_spec):
    return api_spec["info"]["version"] if is_not_empty(api_spec["info"]) else None


def is_valid_version(api_spec_version):
    return is_not_empty(api_spec_version) and bool(version_pattern.match(api_spec_version))


def set_new_version(api_spec, new_version):
    api_spec["info"]["version"] = new_version


def get_api_service_name(api_spec):
    return api_spec["name"]


def increment_version(current_version: Version):
    return '%d.%d.%d' % (
        current_version.get_major_version(), current_version.get_minor_version(),
        (current_version.get_build_version() + 1))


def get_latest_spec(service_name):
    latest_spec: ApiSpecEntry = spec_repo.find_latest_spec_by_name(service_name)
    print(f'{service_name}'f's latest spec:{latest_spec}')
    return latest_spec


def get_service_names_with_specs():
    return spec_repo.find_distinct_service_names()


def get_service_names_with_proposals():
    return proposal_repo.find_distinct_proposal_service_names()


def get_specifications_by_params(service_name, version):
    if is_empty(service_name):
        print("Error missing service_name")
        return []

    if is_empty(version):
        return spec_repo.find_specs_by_name(service_name)
    else:
        return spec_repo.find_specs_by_name_and_version(service_name, version)


def get_single_spec_by_name_and_version(service_name, version):
    specs = spec_repo.find_specs_by_name_and_version(service_name, version)
    if specs is not None and len(specs) >= 1:
        return specs[0]
    else:
        return None


def extract_api_specs(apiclarity_specs, update_new_reconstructed_services):
    for spec_wrapper in apiclarity_specs:
        service_name = get_api_service_name(spec_wrapper)

        if not has_reconstructed_spec(spec_wrapper):
            print(f'No reconstructed specs for service={service_name}')
            continue

        proposal_repo.delete_by_name_and_return_timestamp_of_previous(service_name)
        reconstructed_spec = json.loads(get_reconstructed_spec(spec_wrapper))
        proposal_repo.insert_api_spec_proposal(service_name, reconstructed_spec)

        print(f'Inserted a new proposal for service={service_name}')
        update_new_reconstructed_services.append(service_name)


def delete_all_proposals():
    return proposal_repo.delete_all_proposals()


def delete_all_specs(service_name):
    return spec_repo.delete_all_specs(service_name)


def get_proposal(service):
    proposal = proposal_repo.find_proposal_by_name(service)
    return None if proposal is None else proposal["proposed_spec"]


def insert_provided_spec(uploaded_file, service_name):
    api_spec = json.loads(uploaded_file.read())
    api_spec_version = get_api_spec_version(api_spec)
    new_spec_version = api_spec_version

    latest_spec: ApiSpecEntry = spec_repo.find_latest_spec_by_name(service_name)
    latest_spec_version = "0.0.1" if is_empty(latest_spec) else latest_spec.version
    print(f'Latest spec version: {latest_spec_version}')
    if not is_valid_version(api_spec_version) or api_spec_version <= latest_spec_version:
        new_spec_version = increment_version(Version(latest_spec_version))
        print(
            f'Invalid or past version:{api_spec_version}. Setting up an incrementeed version for the api spec:{new_spec_version}')
        set_new_version(api_spec, new_spec_version)

    print(f"Inserting new api spec for service={service_name} and deleting existing proposal for it")
    spec_repo.insert_api_spec(service_name, new_spec_version, api_spec)
    proposal_repo.delete_by_name_and_return_timestamp_of_previous(service_name)

    return new_spec_version


def get_versions(service):
    return spec_repo.find_service_versions(service)
