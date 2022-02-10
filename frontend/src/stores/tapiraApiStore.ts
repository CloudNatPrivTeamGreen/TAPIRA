import { action, observable } from 'mobx';
import tapiraApiService from '../services/tapiraApiService/tapiraApiService';

class TapiraApiStore {

    @observable 
    apiClaritySpecs!: Array<string>;

    @observable
    serviceSpecifications;

    @observable
    currentServiceSpecificationsVersion;

    @action
    async getApiclaritySpecs() {
        const result = await tapiraApiService.getApiclaritySpecs();
        this.apiClaritySpecs = result.reconstructed_services;
    }

    @action
    async getAllServices() {
        const result = await tapiraApiService.getAllServices();
    }

    @action
    async getSpecificationsForService(serviceName: string) {
        const result = await tapiraApiService.getSpecificationsForService(serviceName);
        this.serviceSpecifications = result;
    }

    @action
    async getCurrentVersionSpecForService(serviceName: string) {
        const result = await tapiraApiService.getCurrentVersionSpecForService(serviceName);
        this.currentServiceSpecificationsVersion = result;
    }

    @action
    async uploadExistingAPISpecifications(serviceName: string, data: FormData) {
        const result = await tapiraApiService.uploadExistingAPISpecifications(serviceName, data);
        return result.created_version;
    }
}

export default TapiraApiStore;