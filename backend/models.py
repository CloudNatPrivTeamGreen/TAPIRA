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
