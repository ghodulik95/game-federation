
/*
    To implement, you must definde federateMessage to send the 
    message to a federated server, e.g. Mastodon.
    
    
*/
export default class FederationService {
    constructor() {
        if (new.target === FederationService) {
            throw new Error("Cannot instantiate abstract class FederationService directly.");
        }
        this.fedeeratedGameEventCallback = null
    }
    
    setOnFedEventReceived(cb) {
        this.federatedGameEventCallback = cb;
    }
    
    federateMessageCallback() {
        return (msg) => this.federateMessage(msg);
    }
    
    async start() {
    }
    
    async close() {
        
    }

    handleFederatedGameEvent(message) {
        this.federatedGameEventCallback(message);
    }

    federateMessage(message) {
        throw new Error("Method 'federateMessage' must be implemented.");
    }
}
