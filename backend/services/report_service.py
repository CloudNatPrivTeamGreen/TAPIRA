from backend.repository import report_repo

def get_report_by_timestamps(start_timestamp, end_timestamp):
    print(report_repo.find_report_by_timestamps(start_timestamp,end_timestamp))
    return {"report": {}, "start_timestamp": start_timestamp, "end_timestamp": end_timestamp}
    
def create_report_with_timestamps(start_timestamp, end_timestamp):
    print(report_repo.create_report({"Test":"1234"},start_timestamp,end_timestamp))
    return {"report": {}, "start_timestamp": start_timestamp, "end_timestamp": end_timestamp}

def delete_report_by_timestamps(start_timestamp, end_timestamp):
    report_repo.delete_report_by_timestamps(start_timestamp,end_timestamp)
    return "Report was deleted for time period of " + start_timestamp + "and" + end_timestamp

def get_all_reports():
    print(report_repo.find_all_reports())
    return [{"report": {}, "start_timestamp":"MOCK", "end_timestamp": "MOCK"}]