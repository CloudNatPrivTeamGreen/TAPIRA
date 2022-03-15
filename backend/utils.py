import json
from typing import List, Tuple, Union

from version_parser import Version

NUM_EXAMPLES = 2000


def is_not_empty(string: str) -> bool:
    return string is not None and string != ''


def is_empty(string: str) -> bool:
    return string is None or string == ''


def compare_api_spec_versions(first_spec, second_spec):
    v1: Version = Version(first_spec['version'])
    v2: Version = Version(second_spec['version'])
    v1_major = v1.get_major_version()
    v1_minor = v1.get_minor_version()
    v1_build = v1.get_build_version()

    v2_major = v2.get_major_version()
    v2_minor = v2.get_minor_version()
    v2_build = v2.get_build_version()

    if str(v1) == str(v2):
        return 0
    elif v1_major > v2_major:
        return 1
    elif v1_major < v2_major:
        return -1
    elif v1_minor > v2_minor:
        return 1
    elif v1_minor < v2_minor:
        return -1
    elif v1_build > v2_build:
        return 1
    else:
        return -1


def transform_list_specs(api_specs):
    if api_specs is None:
        return None

    for i in range(len(api_specs)):
        api_specs[i]["api_spec"] = json.dumps(api_specs[i]["api_spec"])

    return api_specs


def transform_spec(spec):
    if spec is None:
        return None
    spec.api_spec = json.dumps(spec.api_spec)
    return spec

# def reduce_differences(new, old):
# ... reduce_differences(schema_differences['new_schema_tira_annotation'], schema_differences['old_schema_tira_annotation'])

def get_tira_changes(annotation: dict, type: str) -> dict:
    new_annotation = {}
    old_annotation = {}
    
    if "changed" in type:
        if type == "schema_changed":
            unfiltered_new_annotation = annotation["new_schema_tira_annotation"]
            unfiltered_old_annotation = annotation["old_schema_tira_annotation"]
        if type == "global_changed":            
            unfiltered_new_annotation = annotation["new_global_tira_annotation"]
            unfiltered_old_annotation = annotation["old_global_tira_annotation"]
        for key, val in unfiltered_new_annotation.items():
            if key == "retention-time":
                for key_, val_ in val.items():
                    if key_ == "review_frequency":
                        for key__, val__ in val_.items():
                            if key in unfiltered_old_annotation and key_ in unfiltered_old_annotation[key] and key__ in unfiltered_old_annotation[key][key_]:
                                old_val = unfiltered_old_annotation[key][key_][key__]
                                try:
                                    if  val__ != old_val:
                                        new_annotation[key + "." + key_ + "." + key__] = val__
                                        old_annotation[key + "." + key_ + "." + key__] = old_val
                                except KeyError:
                                    new_annotation[key + "." + key_ + "." + key__] = val__
                                    old_annotation[key + "." + key_ + "." + key__] = old_val
                            else:
                                new_annotation[key + "." + key_ + "." + key__] = val__
                                old_annotation[key + "." + key_ + "." + key__] = None
                    else:
                        if key in unfiltered_old_annotation and key_ in unfiltered_old_annotation[key]:
                            old_val = unfiltered_old_annotation[key][key_]
                            try:
                                if val_ != old_val:
                                    new_annotation[key + "." + key_] = val_
                                    old_annotation[key + "." + key_] = old_val
                            except KeyError:
                                new_annotation[key + "." + key_] = val_
                                old_annotation[key + "." + key_] = old_val
                        else:
                            new_annotation[key + "." + key_] = val_
                            old_annotation[key + "." + key_] = None
            elif key == "purposes":
                if "yappl" in val:
                    old_val = unfiltered_old_annotation[key]["yappl"]
                    if val["yappl"] != old_val:
                        new_annotation[key + "." + "yappl"] = json.dumps(val["yappl"])
                        old_annotation[key + "." + "yappl"] = old_val
            else:
                try:
                    for key_, val_ in val.items():
                        if key in unfiltered_old_annotation and key_ in unfiltered_old_annotation[key]:
                            old_val = unfiltered_old_annotation[key][key_]
                            try:
                                if val_ != old_val:
                                    new_annotation[key + "." + key_] = val_
                                    old_annotation[key + "." + key_] = old_val
                            except KeyError:
                                new_annotation[key + "." + key_] = val_
                                old_annotation[key + "." + key_] = old_val
                        else:
                            new_annotation[key + "." + key_] = val_
                            old_annotation[key + "." + key_] = None
                except AttributeError:
                    print(key, val, unfiltered_new_annotation)

    elif type == "new":
        for key, val in annotation.items():
            if key == "retention-time":
                for key_, val_ in val.items():
                    if key_ == "review_frequency":
                        for key__, val__ in val_.items():
                            new_annotation[key + "." + key_ + "." + key__] = val__
                            old_annotation[key + "." + key_ + "." + key__] = None
                    else:
                        new_annotation[key + "." + key_] = val_
                        old_annotation[key + "." + key_] = None
            elif key == "purposes":
                if "yappl" in val:
                    new_annotation[key + "." + "yappl"] = json.dumps(val["yappl"])
                    old_annotation[key + "." + "yappl"] = None
            else:
                for key_, val_ in val.items():
                    new_annotation[key + "." + key_] = val_
                    old_annotation[key + "." + key_] = None

    elif type == "missing":
        for key, val in annotation.items():
            if key == "retention-time":
                for key_, val_ in val.items():
                    if key_ == "review_frequency":
                        for key__, val__ in val_.items():
                            new_annotation[key + "." + key_ + "." + key__] = None
                            old_annotation[key + "." + key_ + "." + key__] = val__
                    else:
                        new_annotation[key + "." + key_] = None
                        old_annotation[key + "." + key_] = val_
            elif key == "purposes":
                if "yappl" in val:
                    new_annotation[key + "." + "yappl"] = None
                    old_annotation[key + "." + "yappl"] = json.dumps(val["yappl"])
            else:
                for key_, val_ in val.items():
                    new_annotation[key + "." + key_] = None
                    old_annotation[key + "." + key_] = val_

    return {"old": old_annotation, "new": new_annotation}


def schema_path_walk(schema_name: str, oas: dict, entry: str) -> Tuple[bool, dict]:
    for key, val in oas.items():
        if type(val) is dict:
            found, path = schema_path_walk(schema_name, val, entry)
            if found:
                return True, {key: path}
            else:
                continue
        elif val == schema_name:
            return True, {key: entry}
        else:
            continue
    return False, None


def get_remove_marker(path: Union[dict, str], oas_paths: Union[dict, str], entry: str) -> Union[dict, str]:
    if type(path) is not dict:
        if type(path) is str and type(oas_paths) is str:
            if path == oas_paths:
                return entry
            else:
                return path
        else:
            return path
    current_path_obj = next(iter(path))
    if type(oas_paths) is not dict or current_path_obj not in oas_paths:
        return current_path_obj
    else:
        return get_remove_marker(path[current_path_obj], oas_paths[current_path_obj], entry)


def build_path_answer(path: dict, entry: str, remove_marker: str = None, removed: bool = False) -> dict:
    k, v = next(iter(path.items()))
    if k == remove_marker:
        removed = True
    if "schema" in v:
        entry_ = entry.split("/", 2)[2]
        if remove_marker == entry_:
            removed = True
        return {k: {entry_: {"isRemoved": removed}}, "isRemoved": False}
    elif type(v) is dict:
        remaining_path = build_path_answer(v, entry, remove_marker, removed)
        if remaining_path and type(remaining_path) is dict:
            remaining_path["isRemoved"] = removed 
        return {k: remaining_path}
    

def get_schema_path(entry: str, oas_paths: dict, old_oas_paths: dict = None, missing: bool = False) -> dict:
    response = {}
    paths = []
    entry_ = "#/definitions/" + entry
    relevant_oas_paths = oas_paths if not missing else old_oas_paths

    # find all paths that the schema is used in
    for key, val in relevant_oas_paths.items():
        if type(val) is dict:
            found, path = schema_path_walk(entry_, val, entry)
            if found:
                paths.append({key: path})
            else:
                continue
        elif val == entry_:
            paths.append({key: entry})
        else:
            continue

    if missing:
        # detect, why the schema is not in use anymore
        for path in paths:
            remove_marker = get_remove_marker(path, oas_paths, entry)
            response.update(build_path_answer(path, entry_, remove_marker))
    else:
        for path in paths:
            response.update(build_path_answer(path, entry_))

    return response


def add_path_to_merge_response(path: Union[dict, str], response: Union[dict, str]) -> Union[dict, str]:
    if type(path) is dict:
        for k, v in path.items():
            if type(response) is dict:
                if k in response:
                    return {k: add_path_to_merge_response(v, response[k])}
                else:
                    return_dict = {k: v}
                    return_dict.update(response)
                    return return_dict
            else:
                raise Exception("path and response need to be of same structure!")
        return response
    else:
        if path == response:
            return path
        raise Exception("path and response need to be of same structure!")


def merge_path_entries(paths: List[dict]) -> dict:
    # merge the paths into a single dict
    response = {}
    for path in paths:
        if path:
            response = add_path_to_merge_response(path, response)
    return response