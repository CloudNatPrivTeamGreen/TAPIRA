import { action, observable } from 'mobx';
import testingService from '../services/testingService';
import { ReportResponse } from '../services/tapiraApiComparisonService/comparison-api-dtos';

/**
 * Testing Store is just for testing. Need to be taken out when the real implementation is completed
 */
class TestingStore {
  @observable
  reportsResponse!: ReportResponse[];

  @action
  async getReportsForTesting() {
    const result = await testingService.getReportsForTesting();
    this.reportsResponse = result.reports;
  }
}

export default TestingStore;
