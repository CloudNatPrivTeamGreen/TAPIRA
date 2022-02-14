import { action, observable } from 'mobx';
import tapiraApiSpecificationsService from '../services/tapiraApiSpecificationsService';

class TapiraApiSpecificationsStore {
  @observable
  apiClaritySpecs!: Array<string>;

  @observable
  serviceSpecifications: any;

  @observable
  currentServiceSpecificationsVersion: any;

  @observable
  specsToCompare: any;

  @observable
  versionTags!: Array<string>;

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
  async getCurrentVersionSpecForService(serviceName: string) {
    const result =
      await tapiraApiSpecificationsService.getCurrentVersionSpecForService(
        serviceName
      );
    this.currentServiceSpecificationsVersion = result.api_spec;
  }

  @action
  async uploadExistingAPISpecifications(serviceName: string, data: FormData) {
    const result =
      await tapiraApiSpecificationsService.uploadExistingAPISpecifications(
        serviceName,
        data
      );
    return result.created_version;
  }

  @action
  saveUploadedSpecToCompare(specs: any) {
    this.specsToCompare = specs;
  }

  @action
  async getSpecVersionsForService(serviceName: string) {
    const result =
      await tapiraApiSpecificationsService.getSpecVersionsForService(
        serviceName
      );
    this.versionTags = result.versions;
  }

  @action
  async getSpecificationsForService(serviceName: string, version: string) {
    const result =
      await tapiraApiSpecificationsService.getSpecificationsForService(
        serviceName,
        version
      );
    this.serviceSpecifications = result.api_specs;
  }
}

export default TapiraApiSpecificationsStore;
