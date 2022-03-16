import { action, observable } from 'mobx';
import tapiraApiReportsService from '../services/tapiraApiReportsService';
import {
  ReportResponse,
  RecordingStatus,
} from '../services/tapiraApiReportsService/reports-api';

class TapiraApiReportsStore {
  @observable
  reportsResponse!: ReportResponse[];

  @action
  async fetchReports() {
    const result = await tapiraApiReportsService.fetchReports();
    this.reportsResponse = result.reports;
  }

  @action
  async triggerOrStopRecording(status: RecordingStatus) {
    const result = await tapiraApiReportsService.triggerOrStopRecording(status);
  }
}

export default TapiraApiReportsStore;
