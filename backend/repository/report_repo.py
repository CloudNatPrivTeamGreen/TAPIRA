import datetime

from flask import g
from flask_pymongo import PyMongo

from backend import app
from backend.models.models import ApiDiffs


def get_db():
    if 'db' not in g:
        mongodb_client = PyMongo(app)
        g.db = mongodb_client.db

    return g.db

def create_report(report):
    return get_db().reports.insert_one(report)

def find_report_by_timestamps(start_timestamp, end_timestamp):
    return get_db().reports.find_one({"start_timestamp": start_timestamp, "end_timestamp": end_timestamp})

def delete_report_by_timestamps(start_timestamp, end_timestamp):
    deleted = get_db().reports.delete_one({"start_timestamp": start_timestamp, "end_timestamp": end_timestamp})

    if deleted.deleted_count == 1:
        print(f'Deleted report for timestamps: {start_timestamp} and {end_timestamp}')

def find_all_reports():
    return get_db().reports.find({})

def delete_all_reports():
    deleted_entries = get_db().reports.delete_many({})
    return f'Deleted {deleted_entries.deleted_count} proposals'