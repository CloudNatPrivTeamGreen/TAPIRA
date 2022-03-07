import http from '../httpService';

// Testing Service is just for testing. Need to be taken out when the real implementation is completed
class TestingService {
  public async getReportsForTesting() {
    const result = await http.get('report_test', { params: { case: 'case1' } });
    return result.data;
  }
}

export default new TestingService();
