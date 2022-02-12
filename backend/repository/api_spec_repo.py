##################################################
# Variable Definition
import functools
import json

from flask import g
from flask_pymongo import PyMongo

from backend import app
from backend.models.models import ApiSpecEntry
from backend.utils import compare_api_spec_versions as compare_versions


def get_db():
    if 'db' not in g:
        mongodb_client = PyMongo(app)
        g.db = mongodb_client.db

    return g.db


def insert_api_spec_entry(api_spec_entry):
    print(f"Inserting api spec for service={api_spec_entry.service}:{api_spec_entry.version} "
          f"created at {api_spec_entry.created_at_date}")
    return get_db().api_specifications.insert_one(api_spec_entry.__dict__)


def insert_api_spec(service, version, api_spec):
    return insert_api_spec_entry(ApiSpecEntry(service, version, api_spec))


def find_distinct_service_names():
    names = get_db().api_specifications.find().distinct('service')
    print(f'Found service names with specs: {names}')
    return names


def find_service_versions(service):
    version_specs = list(get_db().api_specifications.find({"service": service}, {"version": 1, "_id": 0}))

    sorted_desc = sorted(version_specs, key=functools.cmp_to_key(compare_versions), reverse=True)
    return [sorted_desc[i]['version'] for i in range(len(sorted_desc))]


def find_specs_by_name(service_name):
    specs = list(get_db().api_specifications.find({"service": service_name}))
    print(f'Found {len(specs)} specs for service_name={service_name}')
    return specs


def find_specs_by_name_and_version(service_name, version):
    specs = list(get_db().api_specifications.find({"service": service_name, "version": version}))
    print(f'Found {len(specs)} specs for service_name={service_name}, version={version}')
    return specs


def find_latest_spec_by_name(service_name):
    specs = list(
        get_db().api_specifications.find({"service": service_name}))
    print(f'Found {len(specs)} specs for service_name={service_name}')

    if len(specs) == 0:
        return None

    latest = sorted(specs, key=functools.cmp_to_key(compare_versions), reverse=True)[0]

    return ApiSpecEntry(latest["service"], latest["version"],
                        json.loads(json.dumps(latest["api_spec"])),
                        latest["created_at_date"])


def delete_all_specs(service_name):
    deleted_entries = get_db().api_specifications.delete_many({"service": service_name})
    print(f'Deleted {deleted_entries.deleted_count} api specs')
    return deleted_entries.deleted_count
