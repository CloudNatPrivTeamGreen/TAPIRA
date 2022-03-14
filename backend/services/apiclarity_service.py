import json
import requests

from backend import config


# def get_hit_count_for_endpoint(first_spec, second_spec):

def get_hit_count(path_parts, method, start_timestamp, end_timestamp):
    response = requests.get(url=f'{config.APICLARITY_API_URL}/api/apiEvents',
                            params={
                                "startTime": start_timestamp,
                                "endTime": end_timestamp,
                                "method[is]": method.upper(),
                                "path[contains]": path_parts,
                                "showNonApi": "false",
                                "page": 1,
                                "pageSize": 1,
                                "sortKey": "time",
                                "sortDir": "DESC"
                                }
                            )
    return response.json()

