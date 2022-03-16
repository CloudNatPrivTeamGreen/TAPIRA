import { action, observable } from 'mobx';
import {
  EvolutionResponse,
  ProposedMergeContext,
} from '../services/tapiraApiComparisonService/comparison-api';
import tapiraApiComparisonService from '../services/tapiraApiComparisonService';
import { downloadFile } from '../utils/download-file-helper';
import tapiraApiProposalsService from '../services/tapiraApiProposalsService';

class TapiraApiComparisonStore {
  @observable
  compareSpecResponse: any;

  @observable
  evolutionResponse!: EvolutionResponse;

  @observable
  uploadedApiSpec: any;

  @action
  async compareSpecsForService(serviceName: string, data: FormData) {
    const result = await tapiraApiComparisonService.compareSpecsForService(
      serviceName,
      data
    );
    this.compareSpecResponse = result;
  }

  @action
  async getConflictsForService(serviceName: string) {
    const result = await tapiraApiProposalsService.getConflictsForService(
      serviceName
    );
    this.compareSpecResponse = result;
  }

  @action
  async getEvolutionForService(
    serviceName: string,
    oldVersion: string,
    newVersion: string
  ) {
    const result = await tapiraApiComparisonService.getEvolutionForService(
      serviceName,
      oldVersion,
      newVersion
    );
    this.evolutionResponse = result;
  }

  @action
  async downloadProposedMerge(
    service_name: string,
    context: ProposedMergeContext,
    newApi: any,
    oldApi: any
  ) {
    const result = await tapiraApiComparisonService.downloadProposedMerge(
      context,
      newApi,
      oldApi
    );
    const blob = new Blob([result], { type: 'application/json' });
    downloadFile(blob, service_name + '_merge.json');
  }

  @action
  saveUploadedApiSpec(uploadedSpec: any) {
    this.uploadedApiSpec = uploadedSpec;
  }
}

export default TapiraApiComparisonStore;
