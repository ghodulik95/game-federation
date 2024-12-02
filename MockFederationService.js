import FederationService from './FederationService.js';

export default class MockFederationService extends FederationService {
    constructor(webSocketClient) {
        super(webSocketClient);
    }
    subscribeToFederatedStream() {
        return true
    }

    federateMessage(message) {
        this.onFederatedMessageReceived(message)
    }
}
