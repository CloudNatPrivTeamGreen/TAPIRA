import datetime
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


def delete_all_proposals():
    deleted_entries = get_db().api_spec_proposals.delete_many({})
    print(f'Deleted {deleted_entries.deleted_count} proposals')
    return deleted_entries.deleted_count


def delete_by_name_and_return_timestamp_of_previous(service):
    existing_proposal = find_proposal_by_name(service)
    create_timestamp = None if existing_proposal is None else existing_proposal["create_timestamp"]
    deleted = get_db().api_spec_proposals.delete_one({"service": service})

    if deleted.deleted_count == 1:
        print(f'{service}: deleted proposal created on:{create_timestamp}')

    return create_timestamp


def insert_api_spec_proposal(name, proposed_spec):
    create_timestamp = datetime.datetime.now()
    return get_db().api_spec_proposals.insert_one(
        {"service": name, "proposed_spec": proposed_spec, "create_timestamp": create_timestamp})


def find_distinct_proposal_service_names():
    names = get_db().api_spec_proposals.find().distinct('service')
    print(f'Found service names with specs: {names}')
    return names


def find_proposal_by_name(service):
    return get_db().api_spec_proposals.find_one({"service": service})
