import json
from datetime import datetime

from backend import globals
from backend.models.models import Report
from backend.repository import report_repo
from backend.services import apiclarity_service
from backend.services import collection_service


def generate_report_out_of_recorded_data(report):
    # Get all Services
    services = collection_service.get_service_names_with_specs()

    total_calls = 0
    report_data = report.report
    for service in services:
        latest_spec_entry = collection_service.get_latest_spec(service)

        latest_spec = latest_spec_entry.api_spec
        version = latest_spec_entry.version

        # Set Service and version in Report
        print(f'Generating report for service {service}')
        report.services[service] = version

        # Get Relevant Paths and Schema for api spec
        paths_and_schemas = get_relevant_paths_and_schemas_for_api_spec(latest_spec)

        for path in paths_and_schemas["paths"]:

            hit_count = get_hit_count_for_path_for_timestamps(
                path, report.start_timestamp, report.end_timestamp)
            print(f"Number of calls={hit_count} for path:{path}, start:{report.start_timestamp}, end:{report.end_timestamp}")
            total_calls += hit_count

            for schema in path["schemas"]:
                curr_schema = paths_and_schemas["schemas"][schema]

                # Update the Purpose in Report
                if curr_schema["purposes"] is not None:
                    for purpose in curr_schema["purposes"]:
                        before = report_data["purposes"][purpose] if purpose in report_data["purposes"] else 0
                        report_data["purposes"][purpose] = before + hit_count

                # Update utilizer in Report
                if curr_schema["utilizer"] is not None:
                    for utilizer in curr_schema["utilizer"]:
                        if utilizer["region"] not in report_data["utilizers"]:
                            report_data["utilizers"][utilizer["region"]] = {
                                "utilizer_values": {},
                                "sum": 0
                            }
                        before = report_data["utilizers"][utilizer["region"]]["utilizer_values"][utilizer["name"]] if \
                            utilizer["name"] in report_data["utilizers"][utilizer["region"]]["utilizer_values"] else 0
                        report_data["utilizers"][utilizer["region"]]["utilizer_values"][
                            utilizer["name"]] = before + hit_count
                        report_data["utilizers"][utilizer["region"]]["sum"] += hit_count

    report.total_calls = total_calls

    if total_calls == 0:
        return report

    # Convert Total Hits to percentages
    for purpose in report_data["purposes"]:
        report_data["purposes"][purpose] = round((report_data["purposes"][purpose] / total_calls) * 100, 1)

    for utilizer in report_data["utilizers"]:
        for value in report_data["utilizers"][utilizer]["utilizer_values"]:
            report_data["utilizers"][utilizer]["utilizer_values"][value] = round((report_data["utilizers"][utilizer][
                                                                                      "utilizer_values"][value] /
                                                                           report_data["utilizers"][utilizer][
                                                                                      "sum"]) * 100, 1)
        report_data["utilizers"][utilizer]["sum"] = round(
            (report_data["utilizers"][utilizer]["sum"] / total_calls) * 100, 1)

    return report


def get_report_by_timestamps(start_timestamp, end_timestamp):
    return report_repo.find_report_by_timestamps(start_timestamp, end_timestamp)


def delete_report_by_timestamps(start_timestamp, end_timestamp):
    report_repo.delete_report_by_timestamps(start_timestamp, end_timestamp)
    return "Report was deleted for time period of " + start_timestamp + "and" + end_timestamp


def get_all_reports():
    return report_repo.find_all_reports()


def delete_all_reports():
    return report_repo.delete_all_reports()


def get_openapi_version(api_spec):
    if "swagger" in api_spec:
        return globals.OPENAPI_V2
    else:
        return globals.OPENAPI_V3


def get_relevant_paths_and_schemas_for_api_spec(api_spec):
    # Determine if specification is openapi v2 or v3
    return get_paths_and_schemas(api_spec, get_openapi_version(api_spec))


def get_tira_purposes(schema):
    if "purposes" in schema["x-tira"]:
        yappl = schema["x-tira"]["purposes"]["yappl"]
        purposes_dict = json.loads(yappl)
        return purposes_dict["preference"][0]["rule"]["purpose"]["permitted"]

    return None


def get_tira_utilizer(schema):
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
        return utilizer

    return None


def get_paths_and_schemas(api_spec, openapi_version):
    print(f'OpenAPI version:{openapi_version}')

    if openapi_version == globals.OPENAPI_V2:
        schemas = api_spec["definitions"]
        schema_path_ref = "#/definitions"
    else:
        schemas = api_spec["components"]["schemas"]
        schema_path_ref = "#/components/schemas"
    paths = api_spec["paths"]

    # Analyze/Determine schemas which contain TIRA annotations
    relevant_schemas = {}
    for schema_key in schemas:
        schema = schemas[schema_key]
        if "x-tira" in schema:
            purposes = get_tira_purposes(schema)
            utilizer = get_tira_utilizer(schema)

            relevant_schemas[schema_key] = {
                "title": schemas[schema_key]["title"],
                "purposes": purposes,
                "utilizer": utilizer
            }

    # Analyze Paths
    relevant_paths = []
    for path in paths:
        for method in paths[path]:
            endpoint = paths[path][method]
            endpoint_string = json.dumps(endpoint)

            found_schemas = []
            for schema in relevant_schemas:
                if f'"$ref": "{schema_path_ref}/{schema}' in endpoint_string:
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

    return apiclarity_service.get_hit_count(path_parts, relevant_path["method"], start_timestamp, end_timestamp)[
        "total"]


def create_report_start_record():
    start_timestamp = datetime.now()

    report_entry = Report(start_timestamp, None)
    report_repo.insert_report(report_entry)

    return start_timestamp


# Get report with latest start timestamp, call ApiClarity and fill the report
def generate_report():
    report = report_repo.get_latest_report()
    print(f'Latest report:{report}')
    report.end_timestamp = datetime.now()
    report = generate_report_out_of_recorded_data(report)

    report_repo.update_report(report)
    return report
