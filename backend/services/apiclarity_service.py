import json
import requests

from backend import config


# def get_hit_count_for_endpoint(first_spec, second_spec):

def test():
    print(config.APICLARITY_API_URL)
    response = requests.get(url=f'{config.APICLARITY_API_URL}/api/apiEvents',
                            params={
                                "startTime": "2022-03-01T11:43:06.156Z",
                                "endTime": "2022-03-02T12:43:06.156Z",
                                "method[is]": "DELETE",
                                "showNonApi": "false",
                                "page": 1,
                                "pageSize": 1,
                                "sortKey": "time",
                                "sortDir": "DESC"
                                }
                            )

    print(response.json())
    return response.json()

