
/*
    To implement, you must definde federateMessage to send the 
    message to a federated server, e.g. Mastodon.
    
    
*/
export default class FederationService {
    constructor() {
        if (new.target === FederationService) {
            throw new Error("Cannot instantiate abstract class FederationService directly.");
        }
        this.federatedMessageListener = null
        this.yukonServerListener = null
    }
    
    setFederatedMessageListener(wsClient) {
        this.federatedMessageListener = wsClient
    }
    
    setYukonServerListener(yukonServerHttpListener) {
        this.yukonServerListener = yukonServerHttpListener
        this.yukonServerListener.setFederationService(this)
    }
    
    start() {
        this.federatedMessageListener.connect()
        this.yukonServerListener.start()
        this.subscribeToFederatedStream()
    }

    handleReceiveMessageFromYukonServer(message) {
        this.federateMessage(message);
    }

    onFederatedMessageReceived(message) {
        this.federatedMessageListener.sendMessageToYukonServer(message);
    }
    
    subscribeToFederatedStream() {
        throw new Error("Method 'subscribeToFederatedStream' must be implemented")
    }

    federateMessage(message) {
        throw new Error("Method 'federateMessage' must be implemented.");
    }
}
