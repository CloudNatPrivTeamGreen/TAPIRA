import http from '../httpService';

class TapiraApiService {

    public async getApiclaritySpecs() {
        const result = await http.get('apiclarity_specs');
        return result.data;
    }

    public async getAllServices() {
        const result = await http.get('services');
        return result.data;
    }

    public async getSpecificationsForService(serviceName: string) {
        const result = await http.get('specifications', { params: { service: serviceName }});
        return result.data;
    }

    public async getCurrentVersionSpecForService(serviceName: string) {
        const result = await http.get('current_version_spec', { params: { service: serviceName}});
        return result.data;
    }
}

export default new TapiraApiService();