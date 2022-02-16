import { Stores } from './storeIdentifier';
import TapiraApiProposalsStore from './tapiraApiProposalsStore';
import TapiraApiSpecificationsStore from './tapiraApiSpecificationsStore';
import TapiraApiComparisonStore from './tapiraApiComparisonStore';
import TestingStore from './testingStore';

export default function initializeStores() {
  return {
    [Stores.TapiraApiSpecificationsStore]: new TapiraApiSpecificationsStore(),
    [Stores.TapiraApiProposalsStore]: new TapiraApiProposalsStore(),
    [Stores.TapiraApiComparisonStore]: new TapiraApiComparisonStore(),
    // Testing Store is just for testing. Need to be taken out when the real implementation is completed
    [Stores.TestingStore]: new TestingStore(),
  };
}
