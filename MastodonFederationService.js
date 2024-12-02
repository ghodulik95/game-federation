import FederationService from './FederationService.js';

export default class MastodonFederationService extends FederationService {
    constructor() {
        super();
    }
    
    onNewFollow(username, serverInstance) {
        // If server instance is this one (social.collectivemoo.net)
        // username = @username
        // Else
        // username = @username@serverInstance
        // 
        // Check if username exists in the users table of the mysql database (column name is username)
        // If not, make a new user with command:
        // INSERT INTO users (username, password, coins) VALUES ('username', 'bcrypt-hashed-password', 999999);
        // Replacing username with the username, and bcrypt-hased-password with a randomly generated,
        // easily human readable password, that is hashed with bcrypt 10 times.
        // Finally, send a private toot to @username@serverInstance sending them their randomly generated password.
        // and telling them the URL for the yukon server.
    }
    
    start() {
        super.start()
        
        // Initialize local mysql database connection using user yukon and passwork my_password
        // Use database yukon
    }
    
    subscribeToFederatedStream() {
        // Using mastodon api, connect to user @yukon-dev@social.collectivemoo.net
        
        // Set up listening so that on a new toot from someone yukon-dev follows, or a toot from themselves,
        // the toot content is passed as json and forwarded to this.onFederatedMessageReceived(message)
        
        return true
    }

    federateMessage(message) {
        // Send the message as json content within a mastodon toot from the
        // @yukon-dev@social.collectivemoo.net account, privacy set to followers only.
    }
}
