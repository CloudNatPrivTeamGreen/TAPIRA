import http from '../httpService';
import { RecordingStatus } from './reports-api';

class TapiraApiReportsService {
  /**
   *
   * @param status The status with which the recording api should be called
   * @returns The status of the recording
   */
  public async triggerOrStopRecording(status: RecordingStatus) {
    const response = await http.post('recording', null, {
      params: { record_status: status },
    });
    return response.data;
  }

  /**
   *
   * @returns fetches all the generated reports and returns them
   */
  public async fetchReports() {
    const response = await http.get('reports');
    return response.data;
  }
}

export default new TapiraApiReportsService();
