import json, copy
from bson import json_util

from backend.repository import report_repo
from backend.services import apiclarity_service
from backend.services import collection_service


class Report:
    def __init__(self, start_timestamp, end_timestamp):
        self.data = {
            "purposes": {},
            "utilizers": {}
        }
        self.services = {}
        self.total_calls = 0
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp

def create_report_with_timestamps(start_timestamp, end_timestamp):
    report = Report(start_timestamp=start_timestamp,
                    end_timestamp=end_timestamp)

    # Get all Services
    services = collection_service.get_service_names_with_specs()

    total_calls = 0
    for service in services:
        ###latest_spec = collection_service.get_latest_spec(service)
        version = collection_service.get_api_spec_version(latest_spec)

        # Set Service and version in Report

        report.services[service] = version

        # Get Relevant Paths and Schema for api spec
        paths_and_schemas = get_relevant_paths_and_schemas_for_api_spec(latest_spec)

        for path in paths_and_schemas["paths"]:
            hit_count = get_hit_count_for_path_for_timestamps(
                path, start_timestamp, end_timestamp)

            total_calls += hit_count

            for schema in path["schemas"]:
                curr_schema = paths_and_schemas["schemas"][schema]

                # Update the Purpose in Report
                if curr_schema["purposes"] is not None:
                    for purpose in curr_schema["purposes"]:
                        before = report.data["purposes"][purpose] if purpose in report.data["purposes"] else 0
                        report.data["purposes"][purpose] = before + hit_count

                # Update utilizer in Report
                if curr_schema["utilizer"] is not None:
                    for utilizer in curr_schema["utilizer"]:
                        if utilizer["region"] not in report.data["utilizers"]:
                            report.data["utilizers"][utilizer["region"]] = {
                                "utilizer_values":{},
                                "sum": 0
                            }
                        before = report.data["utilizers"][utilizer["region"]]["utilizer_values"][utilizer["name"]] if utilizer["name"] in report.data["utilizers"][utilizer["region"]]["utilizer_values"] else 0
                        report.data["utilizers"][utilizer["region"]]["utilizer_values"][utilizer["name"]] = before + hit_count
                        report.data["utilizers"][utilizer["region"]]["sum"] += hit_count 


    report.total_calls = total_calls

    # Convert Total Hits to percentages
    for purpose in report.data["purposes"]:
        report.data["purposes"][purpose] = round((report.data["purposes"][purpose] / total_calls) * 100,1)
    
    for utilizer in report.data["utilizers"]:
        for value in report.data["utilizers"][utilizer]["utilizer_values"]:
            report.data["utilizers"][utilizer]["utilizer_values"] = round((report.data["utilizers"][utilizer]["utilizer_values"][value]/ report.data["utilizers"][utilizer]["sum"]) * 100,1)
        report.data["utilizers"][utilizer]["sum"] = round((report.data["utilizers"][utilizer]["sum"]/ total_calls) * 100,1)

    report_copy = copy.deepcopy(report)

    #Save to database
    report_repo.create_report(report.__dict__)
    return report_copy.__dict__

def get_report_by_timestamps(start_timestamp, end_timestamp):
    return report_repo.find_report_by_timestamps(start_timestamp, end_timestamp)


def delete_report_by_timestamps(start_timestamp, end_timestamp):
    report_repo.delete_report_by_timestamps(start_timestamp, end_timestamp)
    return "Report was deleted for time period of " + start_timestamp + "and" + end_timestamp


def get_all_reports():
    return report_repo.find_all_reports()

def delete_all_reports():
    return report_repo.delete_all_reports()

############, start_timestamp, end_timestamp



def get_relevant_paths_and_schemas_for_api_spec(api_spec):
    # Analyze/Determine schemas which contain TIRA annotations
    relevant_schemas = {}
    for schema_key in api_spec["components"]["schemas"]:
        schema = api_spec["components"]["schemas"][schema_key]
        if "x-tira" in schema:
            purposes = None
            utilizer = None

            if "purposes" in schema["x-tira"]:
                yappl = schema["x-tira"]["purposes"]["yappl"]
                purposes_dict = json.loads(yappl)
                purposes = purposes_dict["preference"][0]["rule"]["purpose"]["permitted"]
            if "utilizer" in schema["x-tira"]:
                utilizer = []
                for util in schema["x-tira"]["utilizer"]:

                    region = util["country"] if util["non_eu_country"] else "EU"
                    name = util["name"]
                    utilizer.append(
                        {
                            "region": region,
                            "name": name
                        }
                    )

            relevant_schemas[schema_key] = {
                "title": api_spec["components"]["schemas"][schema_key]["title"],
                "purposes": purposes,
                "utilizer": utilizer
            }

    # Analyze Paths
    relevant_paths = []
    for path in api_spec["paths"]:
        for method in api_spec["paths"][path]:
            endpoint = api_spec["paths"][path][method]
            endpoint_string = json.dumps(endpoint)

            found_schemas = []
            for schema in relevant_schemas:
                if f'"$ref": "#/components/schemas/{schema}' in endpoint_string:
                    found_schemas.append(schema)

            if found_schemas:
                relevant_paths.append(
                    {
                        "method": method,
                        "path": path,
                        "schemas": found_schemas
                    }
                )

    return {
        "schemas": relevant_schemas,
        "paths": relevant_paths
    }


def get_hit_count_for_path_for_timestamps(relevant_path, start_timestamp, end_timestamp):
    path = relevant_path["path"]
    path_parts = path.split("/")
    for part in path_parts:
        if part == '' or "{" in part:
            path_parts.remove(part)

    return apiclarity_service.get_hit_count(path_parts, relevant_path["method"], start_timestamp, end_timestamp)["total"]


#####
def create_report_with_timestamps_hardcode(start_timestamp, end_timestamp):
    report = Report(start_timestamp=start_timestamp,
                    end_timestamp=end_timestamp)

    # Get all Services
    ###services = collection_service.get_service_names_with_specs()
    services = ["carts"]

    total_calls = 0
    for service in services:
        ###latest_spec = collection_service.get_latest_spec(service)
        ###version = collection_service.get_api_spec_version(latest_spec)
        version = "1.0"

        # Set Service and version in Report

        report.services[service] = version

        # Get Relevant Paths and Schema for api spec
        ###relevant_paths = get_relevant_paths_and_schemas_for_api_spec(latest_spec)
        paths_and_schemas = {
            "paths": [
                {
                    "method": "get",
                    "path": "/carts/{customerId}",
                    "schemas": [
                        "Getcartresponse"
                    ]
                },
                {
                    "method": "post",
                    "path": "/carts/{customerId}/items",
                    "schemas": [
                        "CartItem"
                    ]
                }
            ],
            "schemas": {
                "CartItem": {
                    "purposes": [
                        "FitnessData Sharing",
                        "Health Insurance Bonus Program"
                    ],
                    "title": "Cart item",
                    "utilizer": None
                },
                "Getcartresponse": {
                    "purposes": None,
                    "title": "Get cart response",
                    "utilizer": [
                        {
                            "name": "MyFitnessPal",
                            "region": "EU"
                        },
                        {
                            "name": "Strava",
                            "region": "USA"
                        }
                    ]
                }
            }
        }

        for path in paths_and_schemas["paths"]:
            hit_count = get_hit_count_for_path_for_timestamps(
                path, start_timestamp, end_timestamp)

            total_calls += hit_count

            for schema in path["schemas"]:
                curr_schema = paths_and_schemas["schemas"][schema]

                # Update the Purpose in Report
                if curr_schema["purposes"] is not None:
                    for purpose in curr_schema["purposes"]:
                        before = report.data["purposes"][purpose] if purpose in report.data["purposes"] else 0
                        report.data["purposes"][purpose] = before + hit_count

                # Update utilizer in Report
                if curr_schema["utilizer"] is not None:
                    for utilizer in curr_schema["utilizer"]:
                        if utilizer["region"] not in report.data["utilizers"]:
                            report.data["utilizers"][utilizer["region"]] = {
                                "utilizer_values":{},
                                "sum": 0
                            }
                        before = report.data["utilizers"][utilizer["region"]]["utilizer_values"][utilizer["name"]] if utilizer["name"] in report.data["utilizers"][utilizer["region"]]["utilizer_values"] else 0
                        report.data["utilizers"][utilizer["region"]]["utilizer_values"][utilizer["name"]] = before + hit_count
                        report.data["utilizers"][utilizer["region"]]["sum"] += hit_count 


    report.total_calls = total_calls

    # Convert Total Hits to percentages
    for purpose in report.data["purposes"]:
        report.data["purposes"][purpose] = round((report.data["purposes"][purpose] / total_calls) * 100,1)
    
    for utilizer in report.data["utilizers"]:
        for value in report.data["utilizers"][utilizer]["utilizer_values"]:
            report.data["utilizers"][utilizer]["utilizer_values"] = round((report.data["utilizers"][utilizer]["utilizer_values"][value]/ report.data["utilizers"][utilizer]["sum"]) * 100,1)
        report.data["utilizers"][utilizer]["sum"] = round((report.data["utilizers"][utilizer]["sum"]/ total_calls) * 100,1)

    report_copy = copy.deepcopy(report)

    #Save to database
    report_repo.create_report(report.__dict__)
    return report_copy.__dict__