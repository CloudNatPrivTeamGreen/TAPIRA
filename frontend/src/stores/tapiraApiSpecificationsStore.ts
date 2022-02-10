import { action, observable } from 'mobx';
import tapiraApiSpecificationsService from '../services/tapiraApiSpecificationsService';

class TapiraApiSpecificationsStore {

    @observable 
    apiClaritySpecs!: Array<string>;

    @observable
    serviceSpecifications;

    @observable
    currentServiceSpecificationsVersion;

    @action
    async getApiclaritySpecs() {
        const result = await tapiraApiSpecificationsService.getApiclaritySpecs();
        this.apiClaritySpecs = result.reconstructed_services;
    }

    @action
    async getAllServices() {
        const result = await tapiraApiSpecificationsService.getAllServices();
    }

    @action
    async getSpecificationsForService(serviceName: string) {
        const result = await tapiraApiSpecificationsService.getSpecificationsForService(serviceName);
        this.serviceSpecifications = result;
    }

    @action
    async getCurrentVersionSpecForService(serviceName: string) {
        const result = await tapiraApiSpecificationsService.getCurrentVersionSpecForService(serviceName);
        this.currentServiceSpecificationsVersion = result;
    }

    @action
    async uploadExistingAPISpecifications(serviceName: string, data: FormData) {
        const result = await tapiraApiSpecificationsService.uploadExistingAPISpecifications(serviceName, data);
        return result.created_version;
    }
}

export default TapiraApiSpecificationsStore;