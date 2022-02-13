import { action, observable } from 'mobx';
import tapiraApiComparisonService from '../services/tapiraApiComparisonService';

class TapiraApiComparisonStore {
  @observable
  compareSpecResponse: any;

  @action
  async compareSpecsForService(serviceName: string, data: FormData) {
    const result = await tapiraApiComparisonService.compareSpecsForService(
      serviceName,
      data
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
  }
}

export default TapiraApiComparisonStore;
