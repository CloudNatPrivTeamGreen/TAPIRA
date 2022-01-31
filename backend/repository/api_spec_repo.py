##################################################
# Variable Definition
import json

import pymongo
from flask import g
from flask_pymongo import PyMongo

from backend import app
from backend.models import ApiSpecEntry
from backend import globals

def get_db():
    if 'db' not in g:
        mongodb_client = PyMongo(app)
        g.db = mongodb_client.db

    return g.db


def insert_api_spec_entry(api_spec_entry):
    print(f"Inserting api spec for service={api_spec_entry.name}:{api_spec_entry.version} "
          f"created at {api_spec_entry.created_at_date}")
    return get_db().api_specifications.insert_one(api_spec_entry.__dict__)


def insert_api_spec(name, port, version, api_spec):
    return insert_api_spec_entry(ApiSpecEntry(name, port, version, api_spec))


def find_distinct_service_names():
    names = get_db().api_specifications.find().distinct('name')
    print(f'Found service names with specs: {names}')
    return names


def find_specs_by_name(service_name):
    specs = list(get_db().api_specifications.find({"name": service_name}))
    print(f'Found {len(specs)} specs for service_name={service_name}')
    return specs


def find_specs_by_name_and_version(service_name, version):
    specs = list(get_db().api_specifications.find({"name": service_name, "version": version}))
    print(f'Found {len(specs)} specs for service_name={service_name}, version={version}')
    return specs


def find_specs_by_name_and_type(service_name, spec_type):
    specs = list(get_db().api_specifications.find({"name": service_name, "spec_type": spec_type}))
    print(f'Found {len(specs)} specs for service_name={service_name}, spec_type={spec_type}')
    return specs


def find_specs_by_name_version_type(service_name, version, spec_type):
    specs = list(get_db().api_specifications.find({"name": service_name, "version": version, "type": spec_type}))
    print(f'Found {len(specs)} specs for service_name={service_name}, version={version}, spec_type={spec_type}')
    return specs


def find_latest_spec_by_name_type(service_name, spec_type):
    specs = list(
        get_db().api_specifications.find({"name": service_name, "spec_type": spec_type}).sort("version", pymongo.DESCENDING))
    print(f'Found {len(specs)} specs for service_name={service_name}, spec_type={spec_type}')
    return None if len(specs) == 0 else ApiSpecEntry(specs[0]["name"], specs[0]["spec_type"], specs[0]["version"],
                                                     json.loads(json.dumps(specs[0]["api_spec"])), specs[0]["created_at_date"])


def delete_all_reconstructed():
    x = get_db().api_specifications.delete_many({"spec_type": globals.RECONSTRUCTED_SPEC_TYPE})
    return x.deleted_count

