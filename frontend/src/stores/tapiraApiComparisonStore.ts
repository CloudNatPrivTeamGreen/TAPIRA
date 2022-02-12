import { action, observable } from 'mobx';
import tapiraApiComparisonService from '../services/tapiraApiComparisonService';

class TapiraApiComparisonStore {
  @observable
  compareSpecReponse: any;

  @action
  async compareSpecsForService(serviceName: string, data: FormData) {
    const result = await tapiraApiComparisonService.compareSpecsForService(
      serviceName,
      data
    );
    this.compareSpecReponse = result;
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
  }
}

export default TapiraApiComparisonStore;
