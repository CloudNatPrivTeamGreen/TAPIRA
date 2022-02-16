import http from '../httpService';

class TapiraApiProposalsService {
  public async deletePorposedSpecifications() {
    const result = await http.delete('housekeeping');
    return result.data;
  }

  public async getServicesWithProposedSpecs() {
    const result = await http.get('service_proposals');
    return result.data;
  }

  public async getProposedSpecsForService(serviceName: string) {
    const result = await http.get('proposal', {
      params: { service: serviceName },
    });
    return result.data;
  }

  public async getConflictsForService(serviceName: string) {
    const result = await http.get('conflict', {
      params: { service: serviceName },
    });
    return result.data;
  }

  public async getAllConflicts() {
    const result = await http.post('conflicts');
    return result.data;
  }
}

export default new TapiraApiProposalsService();
