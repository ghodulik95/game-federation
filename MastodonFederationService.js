import FederationService from './FederationService.js';

export default class MastodonFederationService extends FederationService {
    constructor() {
        super();
    }
    
    onNewFollow(username, serverInstance) {
        // If server instance is this one (social.collectivemoo.net)
        // Add user @username
        // Else add user @username@serverInstance
        
        // For now probably just set password to testpass
        // In the future, maybe send dm to new follower with password
        
        // (Maybe make a simple webpage for resetting password)
    }
    
    subscribeToFederatedStream() {
        // TODO: Listen for toots from Mastodon client, and
        // forward to this.onFederatedMessageReceived(message)
        
        // Listen for all toots from followers, as well as self (?)
        return true
    }

    federateMessage(message) {
        // TODO: Send out to Mastodon as toot
        // Followers only
        this.onFederatedMessageReceived(message)
    }
}
