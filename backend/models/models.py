import datetime


class ApiSpecEntry:
    def __init__(self, service, version, api_spec, created_at_date=datetime.datetime.now()):
        self.service = service
        self.version = version
        self.api_spec = api_spec
        self.created_at_date = created_at_date


class ApiSpecs:
    def __init__(self, api_specs):
        self.api_specs = api_specs


class NewEndpoint:
    path_url: str
    method: str
    summary: str
    path_is_new: bool

    def __init__(self, path_url, method, summary, path_is_new):
        self.path_url = path_url
        self.method = method
        self.summary = summary
        self.path_is_new = path_is_new


class MissingEndpoint:
    path_url: str
    method: str
    summary: str
    path_is_still_present: bool

    def __init__(self, path_url, method, summary, path_is_still_present):
        self.path_url = path_url
        self.method = method
        self.summary = summary
        self.path_is_still_present = path_is_still_present


class ChangedOperation:
    path_url: str
    method: str
    changed_fields: [str]

    def __init__(self, path_url, method, changed_fields):
        self.path_url = path_url
        self.method = method
        self.changed_fields = changed_fields


class ApiDiffs:
    general_difference_given: bool
    potentially_privacy_related_differences_given: bool
    new_endpoints: [NewEndpoint]
    missing_endpoints: [MissingEndpoint]
    changed_operations: [ChangedOperation]

    def __init__(self, general_difference_given,
                 potentially_privacy_related_differences_given, new_endpoints,
                 missing_endpoints,
                 changed_operations):
        print(f'Init of ApiDiff:general_difference_given={general_difference_given}')
        print(f'Init of ApiDiff:new_endpoints={new_endpoints}')
        self.general_difference_given = general_difference_given
        self.potentially_privacy_related_differences_given = potentially_privacy_related_differences_given
        self.new_endpoints = new_endpoints
        self.missing_endpoints = missing_endpoints
        self.changed_operations = changed_operations


class Report:
    def __init__(self, start_timestamp, end_timestamp):
        self.report = {
            "purposes": {},
            "utilizers": {}
        }
        self.services = {}
        self.total_calls = 0
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp
