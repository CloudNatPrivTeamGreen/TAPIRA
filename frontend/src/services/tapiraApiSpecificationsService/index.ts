import http from '../httpService';

class TapiraApiSpecificationsService {

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
        const result = await http.get('current_version_spec', { params: { service: serviceName }});
        return result.data;
    }

    public async uploadExistingAPISpecifications(serviceName: string, data: FormData) {
        const result = await http.post('upload', data, 
            { 
                params: { 
                    service: serviceName
                }, 
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return result.data;
    }
}

export default new TapiraApiSpecificationsService();