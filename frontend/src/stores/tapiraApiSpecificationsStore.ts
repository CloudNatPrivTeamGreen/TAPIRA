import { action, observable } from 'mobx';
import tapiraApiSpecificationsService from '../services/tapiraApiSpecificationsService';

class TapiraApiSpecificationsStore {

    @observable 
    apiClaritySpecs!: Array<string>;

    @observable
    serviceSpecifications: any;

    @observable
    serviceSpecificationsVersion: any;

    @observable
    currentServiceSpecificationsVersion: any;

    @observable
    specsToCompare: any;

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
    async getSpecificationsForServiceVersion(serviceName: string, servVersion: string) {
        const result = await tapiraApiSpecificationsService.getSpecificationsForServiceVersion(serviceName, servVersion);
        this.serviceSpecificationsVersion = result.api_specs;
    }

    @action
    async getCurrentVersionSpecForService(serviceName: string) {
        const result = await tapiraApiSpecificationsService.getCurrentVersionSpecForService(serviceName);
        this.currentServiceSpecificationsVersion = result.api_spec;
    }

    @action
    async uploadExistingAPISpecifications(serviceName: string, data: FormData) {
        const result = await tapiraApiSpecificationsService.uploadExistingAPISpecifications(serviceName, data);
        return result.created_version;
    }

    @action
    saveUploadedSpecToCompare(specs: any) {
        this.specsToCompare = specs;
    }
}

export default TapiraApiSpecificationsStore;