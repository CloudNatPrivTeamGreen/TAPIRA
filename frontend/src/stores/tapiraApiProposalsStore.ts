import { action, observable } from 'mobx';
import tapiraApiProposalsService from '../services/tapiraApiProposalsService';

class TapiraApiProposalsStore {
  @action
  async deletePorposedSpecifications() {
    const result =
      await tapiraApiProposalsService.deletePorposedSpecifications();
  }

  @action
  async getServicesWithProposedSpecs() {
    const result =
      await tapiraApiProposalsService.getServicesWithProposedSpecs();
  }

  @action
  async getProposedSpecsForService(serviceName: string) {
    const result = await tapiraApiProposalsService.getProposedSpecsForService(
      serviceName
    );
  }

  @action
  async getConflictsForService(serviceName: string) {
    const result = await tapiraApiProposalsService.getConflictsForService(
      serviceName
    );
  }
}

export default TapiraApiProposalsStore;
