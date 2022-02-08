import json

import requests

from backend import config


def get_api_diffs(first_spec, second_spec):
    # first_spec_corrected = json.loads(first_spec)
    # second_spec_corrected = json.loads(second_spec)
    response = requests.get(url=f'{config.APIDIFF_URL}/apidiff/relevantChanges',
                                data=json.dumps({"oldApiSpec": json.dumps(first_spec),
                                                      "newApiSpec": json.dumps(second_spec)}),
    headers={"Content-Type": "application/json"})
    print(f'response:{response}')

    return
