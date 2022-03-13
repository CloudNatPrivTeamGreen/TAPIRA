from os import abort

from flask import g
from flask_pymongo import PyMongo

from backend import app
from backend.models.models import Report


def get_db():
    if 'db' not in g:
        mongodb_client = PyMongo(app)
        g.db = mongodb_client.db

    return g.db


def insert_report(report):
    return get_db().reports.insert_one(report.__dict__)


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


def update_report(report):
    newvalues = {
        "$set": {
            'end_timestamp': report.end_timestamp,
            'services': report.services,
            'total_calls': report.total_calls,
            'report': report.report
        }
    }

    print(f'Updating report with start:{report.start_timestamp} and end:{report.end_timestamp}')
    return get_db().reports.update_one({'start_timestamp': report.start_timestamp}, newvalues)


def get_latest_report():
    cursor = get_db().reports.find().sort('start_timestamp', -1).limit(1)
    print(f'Cursor:{cursor}')

    for item in cursor:
        report = Report(item["start_timestamp"], item["end_timestamp"])
        report.services = item["services"]
        report.report = item["report"]
        report.total_calls = item["total_calls"]

        return report

    # if no items in cursor means no reports have been found in the database
    abort(404, "No reports generated")
