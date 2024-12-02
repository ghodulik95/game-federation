import FederationService from './FederationService.js';

export default class CustomFederationService extends FederationService {
    constructor(webSocketClient) {
        super(webSocketClient);
    }

    onFollowingToot(message) {
        console.log("Custom behavior for onFollowingToot:");
        this.webSocketClient.sendMessageToYukonServer(message);
    }

    federate(message) {
        console.log("Custom behavior for federate:");
        this.onFollowingToot(message);
    }
}
