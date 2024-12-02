import FederationService from './FederationService.js';

export default class MockFederationService extends FederationService {
    constructor() {
        super();
    }
    
    subscribeToFederatedStream() {
        return true
    }

    federateMessage(message) {
        this.onFederatedMessageReceived(message)
    }
}
