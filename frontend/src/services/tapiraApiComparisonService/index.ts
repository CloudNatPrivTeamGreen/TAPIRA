import { AxiosRequestConfig } from 'axios';
import http from '../httpService';
import {
  ProposedMergeContext,
  IProposedMergeBody,
} from './comparison-api-dtos';

class TapiraApiComparisonService {
  public async compareSpecsForService(serviceName: string, data: FormData) {
    const result = await http.post('comparison', data, {
      params: { service: serviceName },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return result.data;
  }

  public async getEvolutionForService(
    serviceName: string,
    oldVersion: string,
    newVersion: string
  ) {
    const result = await http.get('evolution', {
      params: {
        service: serviceName,
        old_version: oldVersion,
        new_version: newVersion,
      },
    });
    return result.data;
  }

  public async downloadProposedMerge(
    context: ProposedMergeContext,
    newApi: any,
    oldApi: any
  ) {
    const body: IProposedMergeBody = {
      new_api: newApi,
      old_api: oldApi,
    };
    const config: AxiosRequestConfig = {
      params: { context },
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    };
    const result = await http.post('proposed_merge', body, config);

    return result.data;
  }
}

export default new TapiraApiComparisonService();
