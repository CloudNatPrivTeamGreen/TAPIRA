import http from '../httpService';

// Testing Service is just for testing. Need to be taken out when the real implementation is completed
class TestingService {
  public async getEvolutionForTesting() {
    const result = await http.get('evolution_test', {
      params: { service: 'user', old_version: '1.0.0', new_version: '1.0.1' },
    });

    return result.data;
  }
}

export default new TestingService();
