import requests
import json
from backend import app



@app.route("/api/mirror")
def mirror():
    return requests.get('http://localhost:3000/api_inventory').content


@app.route("/api/apiSpecs")
def get_api_specs():
    response = requests.get('http://localhost:3000/api_inventory')
    response_list = json.loads(response.content.decode('utf-8'))

    for api_info in response_list:
        print(api_info.keys())
        if(api_info["reconstructed_spec"]) != "":
            print("OpenAPI Spec defined for: %s:%s" % (api_info["name"], api_info["port"]))
            process_spec(api_info["reconstructed_spec"])

    return "test"


def process_spec(api_spec_string):
    open_api_spec = json.loads(api_spec_string)
    print(open_api_spec)
    return