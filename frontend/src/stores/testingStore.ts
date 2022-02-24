import { action, observable } from 'mobx';
import testingService from '../services/testingService';
import {
  EvolutionResponse,
  ReportResponse,
} from '../services/tapiraApiComparisonService/comparison-api-dtos';

/**
 * Testing Store is just for testing. Need to be taken out when the real implementation is completed
 */
class TestingStore {
  @observable
  evolutionResponse!: EvolutionResponse;

  @observable
  reportsResponse!: ReportResponse[];

  @action
  async getEvolutionForTest() {
    const result = await testingService.getEvolutionForTesting();
    this.evolutionResponse = result;
  }

  @action
  async getReportsForTesting() {
    const result = await testingService.getReportsForTesting();
    this.reportsResponse = [result];
  }
}

export default TestingStore;
