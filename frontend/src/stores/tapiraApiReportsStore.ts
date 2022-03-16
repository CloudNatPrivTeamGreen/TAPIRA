import { action, observable } from 'mobx';
import tapiraApiReportsService from '../services/tapiraApiReportsService';
import {
  ReportResponse,
  RecordingStatus,
  RecordStatusEnumMap,
} from '../services/tapiraApiReportsService/reports-api';

class TapiraApiReportsStore {
  @observable
  reportsResponse!: ReportResponse[];

  @observable
  triggerReportsResponse!: RecordingStatus;

  @action
  async fetchReports() {
    const result = await tapiraApiReportsService.fetchReports();
    this.reportsResponse = result.reports;
  }

  @action
  async triggerOrStopRecording(status: RecordingStatus) {
    const result = await tapiraApiReportsService.triggerOrStopRecording(status);
    this.triggerReportsResponse =
      RecordStatusEnumMap.get(result.record_status) ?? RecordingStatus.OFF;
  }
}

export default TapiraApiReportsStore;
