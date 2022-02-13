import http from '../httpService';

class TapiraApiComparisonService {
  public async compareSpecsForService(serviceName: string, data: FormData) {
    const result = await http.post('comparison', data, {
      params: { service: serviceName },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return result.data;
  }

  public async getEvolutionForService(
    serviceName: string,
    oldVersion: string,
    newVersion: string
  ) {
    const result = await http.get('evolution', {
      params: {
        service: serviceName,
        old_version: oldVersion,
        new_version: newVersion,
      },
    });
    return result.data;
  }
}

export default new TapiraApiComparisonService();
