import { Stores } from './storeIdentifier';
import TapiraApiProposalsStore from './tapiraApiProposalsStore';
import TapiraApiSpecificationsStore from './tapiraApiSpecificationsStore';
import TapiraApiComparisonStore from './tapiraApiComparisonStore';
import TapiraApiReportsStore from './tapiraApiReportsStore';

export default function initializeStores() {
  return {
    [Stores.TapiraApiSpecificationsStore]: new TapiraApiSpecificationsStore(),
    [Stores.TapiraApiProposalsStore]: new TapiraApiProposalsStore(),
    [Stores.TapiraApiComparisonStore]: new TapiraApiComparisonStore(),
    [Stores.TapiraApiReportsStore]: new TapiraApiReportsStore(),
  };
}
