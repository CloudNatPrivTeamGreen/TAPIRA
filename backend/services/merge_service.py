
def get_proposed_merge_for_validation(old_api, new_api, api_diff):
    proposed_merge = old_api.copy()
    merge_new_endpoints(proposed_merge, old_api, new_api, api_diff["newEndpoints"])
    merge_missing_endpoints(proposed_merge, old_api, new_api, api_diff["missingEndpoints"])
    #For now leave out changed operations for validation context
    #merge_changed_operations(proposed_merge, old_api, new_api, api_diff["changedOperations"]) 
    return proposed_merge


def get_proposed_merge_for_comparison(old_api, new_api, api_diff, tira_diff):
    proposed_merge = old_api.copy()
    merge_new_endpoints(proposed_merge, old_api, new_api, api_diff["newEndpoints"])
    merge_missing_endpoints(proposed_merge, old_api, new_api, api_diff["missingEndpoints"])
    merge_changed_operations(proposed_merge, old_api, new_api, api_diff["changedOperations"])
    merge_new_global_tira(proposed_merge, old_api, new_api, tira_diff["newGlobalTiraAnnotation"])
    merge_missing_global_tira(proposed_merge, old_api, new_api, tira_diff["missingGlobalTiraAnnotation"])
    merge_changed_global_tira(proposed_merge, old_api, new_api, tira_diff["changedGlobalTiraAnnotation"])
    merge_new_schema_tira(proposed_merge, old_api, new_api, tira_diff["newSchemaTiraAnnotations"])
    merge_missing_schema_tira(proposed_merge, old_api, new_api, tira_diff["missingSchemaTiraAnnotations"])
    merge_changed_schema_tira(proposed_merge, old_api, new_api, tira_diff["changedSchemaTiraAnnotations"])
    return proposed_merge


def merge_new_endpoints(proposed_merge, old_api, new_api, new_endpoints):
    for endpoint in new_endpoints:
        pathUrl = endpoint["pathUrl"]
        method = endpoint["method"].lower()
        if endpoint["pathIsNew"] and not pathUrl in proposed_merge["paths"]: 
            proposed_merge["paths"][pathUrl] = {}
        proposed_merge["paths"][pathUrl][method] = new_api["paths"][pathUrl][method]

def merge_missing_endpoints(proposed_merge, old_api, new_api, missing_endpoints):
    for endpoint in missing_endpoints:
        pathUrl = endpoint["pathUrl"]
        if not endpoint["pathIsStillPresent"] and pathUrl in proposed_merge["paths"]:
            del proposed_merge["paths"][pathUrl]
        else:
            method = endpoint["method"].lower()
            del proposed_merge["paths"][pathUrl][method]

        

def merge_changed_operations(proposed_merge, old_api, new_api, changed_operations):
    for operation in changed_operations:
        pathUrl = operation["pathUrl"]
        method = operation["method"].lower()
        for field in operation["changedFields"]:
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
        proposed_merge["x-tira"][key] = global_tira["newGlobalTiraAnnotation"]

def merge_new_schema_tira(proposed_merge, old_api, new_api, new_schema_tira):
    for schema_tira in new_schema_tira:
        proposed_merge["components"]["schemas"][schema_tira["schemaName"]]["x-tira"] = schema_tira["schemaTiraAnnotation"]

def merge_missing_schema_tira(proposed_merge, old_api, new_api, missing_schema_tira):
    for schema_tira in missing_schema_tira:
        del proposed_merge["components"]["schemas"][schema_tira["schemaName"]]["x-tira"]

def merge_changed_schema_tira(proposed_merge, old_api, new_api, changed_schema_tira):
    for schema_tira in changed_schema_tira:
        proposed_merge["components"]["schemas"][schema_tira["schemaName"]]["x-tira"] = schema_tira["newSchemaTiraAnnotation"]


