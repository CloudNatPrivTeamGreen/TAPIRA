import json

from version_parser import Version


def is_not_empty(string):
    return string is not None and string != ''


def is_empty(string):
    return string is None or string == ''


def compare_api_spec_versions(first_spec, second_spec):
    v1: Version = Version(first_spec['version'])
    v2: Version = Version(second_spec['version'])
    v1_major = v1.get_major_version()
    v1_minor = v1.get_minor_version()
    v1_build = v1.get_build_version()

    v2_major = v2.get_major_version()
    v2_minor = v2.get_minor_version()
    v2_build = v2.get_build_version()

    if str(v1) == str(v2):
        return 0
    elif v1_major > v2_major:
        return 1
    elif v1_major < v2_major:
        return -1
    elif v1_minor > v2_minor:
        return 1
    elif v1_minor < v2_minor:
        return -1
    elif v1_build > v2_build:
        return 1
    else:
        return -1


def transform_list_specs(api_specs):
    if api_specs is None:
        return None

    for i in range(len(api_specs)):
        api_specs[i]["api_spec"] = json.dumps(api_specs[i]["api_spec"])

    return api_specs


def transform_spec(spec):
    if spec is None:
        return None
    spec.api_spec = json.dumps(spec.api_spec)
    return spec
