import YukonServerWebSocketClient from './YukonServerWebSocketClient.js';
import YukonServerEventListener from './YukonServerEventListener.js';

export default class ProjectExecutor {
    constructor(federatedMessageListener, yukonServerHttpListener, federationService) {
        this.federationService = federationService
        this.federationService.setFederatedMessageListener(federatedMessageListener)
        this.federationService.setYukonServerListener(yukonServerHttpListener)
    }

    run() {
        // Attach WebSocket client to the federation service instance
        this.federationService.start()
    }
}
