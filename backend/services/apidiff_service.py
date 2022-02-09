import json
from types import SimpleNamespace as Namespace

import humps
import requests

from backend import config
from backend.models.models import ApiDiffs


def get_api_diffs(first_spec, second_spec):
    response = requests.get(url=f'{config.APIDIFF_URL}/apidiff/relevantChanges',
                            json={"oldApiSpec": first_spec,
                                  "newApiSpec": second_spec})

    response_body_decamelized = humps.decamelize(response.json())
    api_diffs: ApiDiffs = json.loads(json.dumps(response_body_decamelized), object_hook=lambda d: Namespace(**d))

    return api_diffs
