import { action, observable } from 'mobx';
import tapiraApiService from '../services/tapiraApiService/tapiraApiService';

class TapiraApiStore {

    @action
    async getApiclaritySpecs() {
        const result = await tapiraApiService.getApiclaritySpecs();
    }

    @action
    async getAllServices() {
        const result = await tapiraApiService.getAllServices();
    }

    @action
    async getSpecificationsForService(serviceName: string) {
        const result = await tapiraApiService.getSpecificationsForService(serviceName);
    }

    @action
    async getCurrentVersionSpecForService(serviceName: string) {
        const result = await tapiraApiService.getCurrentVersionSpecForService(serviceName);
    }
}

export default TapiraApiStore;