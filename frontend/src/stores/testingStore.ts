import { action, observable } from 'mobx';
import testingService from '../services/testing-service';
import { EvolutionResponse } from '../services/tapiraApiComparisonService/comparison-api-dtos';

/**
 * Testing Store is just for testing. Need to be taken out when the real implementation is completed
 */
class TestingStore {
  @observable
  evolutionResponse!: EvolutionResponse;

  @action
  async getEvolutionForTest() {
    const result = await testingService.getEvolutionForTesting();
    this.evolutionResponse = result;
  }
}

export default TestingStore;
