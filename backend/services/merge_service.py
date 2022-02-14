from backend.services import apidiff_service as s

def get_proposed_merge_for_validation(old_api, new_api):
    api_diff_reponse = s.get_all_diffs_for_two_openapi_specs("", old_api, new_api)
    api_diff = api_diff_reponse["api_diffs"]

    proposed_merge = old_api.copy()
    merge_new_endpoints(proposed_merge, old_api, new_api, api_diff.new_endpoints)
    merge_missing_endpoints(proposed_merge, old_api, new_api, api_diff.missing_endpoints)
    #For now leave out changed operations for validation context
    #merge_changed_operations(proposed_merge, old_api, new_api, api_diff["changedOperations"]) 
    return proposed_merge


def get_proposed_merge_for_comparison(old_api, new_api):
    api_diff_reponse = s.get_all_diffs_for_two_openapi_specs("", old_api, new_api)
    api_diff = api_diff_reponse["api_diffs"]
    tira_diff = api_diff_reponse["tira_diffs"]

    proposed_merge = old_api.copy()
    merge_new_endpoints(proposed_merge, old_api, new_api, api_diff.new_endpoints)
    merge_missing_endpoints(proposed_merge, old_api, new_api, api_diff.missing_endpoints)
    merge_changed_operations(proposed_merge, old_api, new_api, api_diff.changed_operations)
    merge_new_global_tira(proposed_merge, old_api, new_api, tira_diff["new_global_tira_annotation"])
    merge_missing_global_tira(proposed_merge, old_api, new_api, tira_diff["missing_global_tira_annotation"])
    merge_changed_global_tira(proposed_merge, old_api, new_api, tira_diff["changed_global_tira_annotation"])
    merge_new_schema_tira(proposed_merge, old_api, new_api, tira_diff["new_schema_tira_annotations"])
    merge_missing_schema_tira(proposed_merge, old_api, new_api, tira_diff["missing_schema_tira_annotations"])
    merge_changed_schema_tira(proposed_merge, old_api, new_api, tira_diff["changed_schema_tira_annotations"])
    return proposed_merge


def merge_new_endpoints(proposed_merge, old_api, new_api, new_endpoints):
    for endpoint in new_endpoints:
        pathUrl = endpoint["path_url"]
        method = endpoint["method"].lower()
        if endpoint["path_is_new"] and not pathUrl in proposed_merge["paths"]: 
            proposed_merge["paths"][pathUrl] = {}
        proposed_merge["paths"][pathUrl][method] = new_api["paths"][pathUrl][method]

def merge_missing_endpoints(proposed_merge, old_api, new_api, missing_endpoints):
    for endpoint in missing_endpoints:
        pathUrl = endpoint["path_url"]
        if not endpoint["path_is_still_present"] and pathUrl in proposed_merge["paths"]:
            del proposed_merge["paths"][pathUrl]
        else:
            method = endpoint["method"].lower()
            del proposed_merge["paths"][pathUrl][method]

        

def merge_changed_operations(proposed_merge, old_api, new_api, changed_operations):
    for operation in changed_operations:
        pathUrl = operation["path_url"]
        method = operation["method"].lower()
        for field in operation["changed_fields"]:
            if not field in new_api["paths"][pathUrl][method] and field in proposed_merge["paths"][pathUrl][method]:
                del proposed_merge["paths"][pathUrl][method][field]
            else:
                proposed_merge["paths"][pathUrl][method][field] = new_api["paths"][pathUrl][method][field]

def merge_new_global_tira(proposed_merge, old_api, new_api, new_global_tira):
    if not "x-tira" in proposed_merge:
        proposed_merge["x-tira"] = {}
    for global_tira in new_global_tira:
        for key in global_tira:
            proposed_merge["x-tira"][key] = global_tira[key]

def merge_missing_global_tira(proposed_merge, old_api, new_api, missing_global_tira):
    for global_tira in missing_global_tira:
        for key in global_tira:
            del proposed_merge["x-tira"][key]
    if proposed_merge["x-tira"] == {}:
        del proposed_merge["x-tira"]

def merge_changed_global_tira(proposed_merge, old_api, new_api, changed_global_tira):
    for global_tira in changed_global_tira:
        key = global_tira["key"]
        proposed_merge["x-tira"][key] = global_tira["new_global_tira_annotation"]

def merge_new_schema_tira(proposed_merge, old_api, new_api, new_schema_tira):
    for schema_tira in new_schema_tira:
        proposed_merge["components"]["schemas"][schema_tira["schema_name"]]["x-tira"] = schema_tira["schema_tira_annotation"]

def merge_missing_schema_tira(proposed_merge, old_api, new_api, missing_schema_tira):
    for schema_tira in missing_schema_tira:
        del proposed_merge["components"]["schemas"][schema_tira["schema_name"]]["x-tira"]

def merge_changed_schema_tira(proposed_merge, old_api, new_api, changed_schema_tira):
    for schema_tira in changed_schema_tira:
        proposed_merge["components"]["schemas"][schema_tira["schema_name"]]["x-tira"] = schema_tira["new_schema_tira_annotation"]


