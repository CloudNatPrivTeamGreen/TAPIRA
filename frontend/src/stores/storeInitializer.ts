import { Stores } from './storeIdentifier';
import TapiraApiProposalsStore from './tapiraApiProposalsStore';
import TapiraApiSpecificationsStore from './tapiraApiSpecificationsStore';

export default function initializeStores() {
    return  {
        [Stores.TapiraApiSpecificationsStore]: new TapiraApiSpecificationsStore(),
        [Stores.TapiraApiProposalsStore]: new TapiraApiProposalsStore()
    }
}