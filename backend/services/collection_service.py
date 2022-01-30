import re

from version_parser import Version

from backend import globals
from backend.models import ApiSpecEntry
from backend.repository import api_spec_repo as repo

version_pattern_string = "<<x.x.x>>"
version_pattern = re.compile("[0-9]+\\.[0-9]+\\.[0-9]+$")

version_snapshot_string = "<<x.x.x-SNAPSHOT>>"
version_snapshot_pattern = re.compile("[0-9]+\\.[0-9]+\\.[0-9]+-SNAPSHOT$")


def get_new_provided_spec(spec_wrapper):
    return spec_wrapper["provided_spec"]


def get_new_reconstructed_spec(spec_wrapper):
    return spec_wrapper["reconstructed_spec"]


def get_api_spec_version(api_spec):
    return api_spec["info"]["version"] if api_spec["info"] != "" else None


def is_valid_version(api_spec_version):
    return api_spec_version is not None and bool(version_pattern.match(api_spec_version))


def get_api_service_name(api_spec):
    return api_spec["name"]


def increment_version(current_version: Version):
    return '%d.%d.%d' % (
        current_version.get_major_version(), current_version.get_minor_version(),
        (current_version.get_build_version() + 1))


def get_latest_previous_provided(service_name):
    return repo.find_latest_spec_by_name_type(service_name, globals.PROVIDED_SPEC_TYPE)


def get_service_names_with_specs():
    return repo.find_distinct_service_names()


def get_specifications_by_params(service_name, version, spec_type):
    if service_name is None:
        print("Error missing service_name")
        return []

    if version is None and spec_type is None:
        return repo.find_specs_by_name(service_name)
    elif version is not None and spec_type is None:
        return repo.find_specs_by_name_and_version(service_name, version)
    elif version is None and spec_type is not None:
        return repo.find_specs_by_name_and_type(service_name, spec_type)
    else:
        return repo.find_specs_by_name_version_type(service_name, version, spec_type)


def extract_api_specs(apiclarity_specs, update_new_provided_services, update_new_reconstructed_services):
    for spec_wrapper in apiclarity_specs:
        service_name = get_api_service_name(spec_wrapper)

        new_provided_version = None
        new_reconstructed_version = None

        previous_provided_spec: ApiSpecEntry = get_latest_previous_provided(service_name)
        new_provided_spec = get_new_provided_spec(spec_wrapper)
        new_reconstructed_spec = get_new_reconstructed_spec(spec_wrapper)

        # Case 1: No provided and reconstructed specs
        if new_reconstructed_spec is None and new_provided_spec is None:
            print("No updates to be made for service: ", service_name)
            continue

        if previous_provided_spec is None and new_provided_spec is None:  # Case 2: No provided specs available
            reconstructed_version = Version('1.0.0')
        elif previous_provided_spec is None and new_provided_spec is not None:  # Case 3: Uploaded reconstructed
            new_provided_version = get_api_spec_version(new_provided_spec)
            new_reconstructed_version = new_provided_version
            print(f'For service {service_name} '
                  f'set provided version={new_provided_version}, new reconstructed version={new_reconstructed_version}')
            pass
        elif previous_provided_spec is not None and new_provided_spec is not None: # Case 4: Conflict uploaded and already existing
            # TODO: think about this one(discard uploaded provided or?)
            new_reconstructed_version = increment_version(Version(previous_provided_spec['version']))
            print(
                f'Previous provided version existing for service {service_name}. '
                f'Set incremented version for reconstructed spec {new_reconstructed_version}')
        elif previous_provided_spec is not None:
            new_reconstructed_version = increment_version(Version(previous_provided_spec['version']))
            print(
                f'Previous provided version existing for service {service_name}. '
                f'Set incremented version for reconstructed spec {new_reconstructed_version}')

        if new_provided_version is not None and new_reconstructed_spec is not None:
            update_new_provided_services.append(service_name)

            repo.insert_api_spec(ApiSpecEntry(
                service_name,
                globals.PROVIDED_SPEC_TYPE,
                new_provided_version,
                new_provided_spec
            ))

        if new_reconstructed_version is not None and new_reconstructed_spec is not None:
            update_new_reconstructed_services.append(service_name)

            repo.insert_api_spec(ApiSpecEntry(
                service_name,
                globals.RECONSTRUCTED_SPEC_TYPE,
                new_reconstructed_version,
                new_reconstructed_spec
            ))