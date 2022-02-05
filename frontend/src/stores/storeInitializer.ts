import { Stores } from './storeIdentifier';
import TapiraApiStore from './tapiraApiStore';

export default function initializeStores() {
    return  {
        [Stores.TapiraApiStore]: new TapiraApiStore(),
    }
}