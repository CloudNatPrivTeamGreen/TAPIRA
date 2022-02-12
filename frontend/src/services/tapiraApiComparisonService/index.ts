import http from '../httpService';

class TapiraApiComparisonService {
    
    public async compareSpecsForService(serviceName: string) {
        const result = await http.get('comparison',  { params: { service: serviceName }});
        return result.data;
    }

    public async getEvolutionForService(serviceName: string, oldVersion: string, newVersion: string) {
        const result = await http.get('evolution', { params: { service: serviceName, old_version: oldVersion, new_version: newVersion }});
        return result.data;
    }
}

export default new TapiraApiComparisonService();