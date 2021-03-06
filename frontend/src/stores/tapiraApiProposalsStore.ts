import { action, observable } from 'mobx';
import tapiraApiProposalsService from '../services/tapiraApiProposalsService';

class TapiraApiProposalsStore {
  @observable
  allConflictsList!: string[];
  @observable
  currentReconstructedSpec: any;

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
    this.currentReconstructedSpec = result.proposal;
  }

  @action
  async getConflictsForService(serviceName: string) {
    const result = await tapiraApiProposalsService.getConflictsForService(
      serviceName
    );
  }

  @action
  async getAllConflicts() {
    const result = await tapiraApiProposalsService.getAllConflicts();
    this.allConflictsList = result.services;
  }
}

export default TapiraApiProposalsStore;
