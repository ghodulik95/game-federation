import FederationService from './FederationService.js';
import config from './config.js';
import {createRestAPIClient, createStreamingAPIClient } from 'masto';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import randomWords from 'random-words';
import WebSocket from 'ws'
import htmlEntities from 'he'; // Import a library for decoding HTML entities

export default class MastodonFederationService extends FederationService {
    constructor(serverInstance = 'social.collectivemoo.net') {
        super();
        this.serverInstance = serverInstance;
        this.mastodonPostingClient = null;
        this.dbConnection = null;
        this.ws = null
    }

    async onNewFollow(username, serverInstance) {
        const fullUsername = serverInstance === this.serverInstance ? `${username}` : `${username}@${serverInstance}`;

        try {
            const [rows] = await this.dbConnection.query(
                'SELECT * FROM users WHERE username = ?',
                [fullUsername]
            );

            if (rows.length === 0) {
                const plainPassword = this.generateReadablePassword();
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                await this.dbConnection.query(
                    'INSERT INTO users (username, password, coins) VALUES (?, ?, ?)',
                    [fullUsername, hashedPassword, 999999]
                );

                const message = `Welcome to Yukon! Here is your login information:\n\nUsername: ${fullUsername}\nPassword: ${plainPassword}\n\nURL: http://${this.serverURL}`;
                //await this.mastodonClient.postStatus(message, { visibility: 'direct' });
                await this.mastodonPostingClient.v1.statuses.create({
                    status: message,
                    visibility: 'direct'
                });
            }
        } catch (error) {
            console.error('Error handling new follow:', error);
        }
    }

    async start() {
        try {
            this.dbConnection = await mysql.createConnection({
                host: 'localhost',
                user: config.yukonUserDbUsername,
                password: config.yukonUserDbPassword,
                database: config.yukonDatabaseName,
            });

            this.mastodonPostingClient = createRestAPIClient({
                url: `https://${this.serverInstance}/api/v1`,
                accessToken: config.yukonMastodonAccountSecretKey,
            });
        } catch (error) {
            console.error('Error initializing MastodonFederationService:', error);
        }
        
        this.subscribeToFederatedStream();
    }
    
    removeHtmlTags(input) {
        return input.replace(/<\/?[^>]+(>|$)/g, '');
    }

    subscribeToFederatedStream() {
        
        // Mastodon API credentials
        const ACCESS_TOKEN = config.yukonMastodonAccountSecretKey; // Replace with your Mastodon access token
        const INSTANCE_URL = 'https://social.collectivemoo.net'; // Replace with your Mastodon instance URL



        (async () => {
            try {
                // Fetch the streaming URL from Mastodon API
                const streamingInfo = await fetch(`${INSTANCE_URL}/api/v1/streaming/health`, {
                    method: 'GET',
                    headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                });

                if (!streamingInfo.ok) {
                    throw new Error(`Failed to fetch streaming info: ${streamingInfo.statusText}`);
                }

                // Establish the WebSocket connection
                this.ws = new WebSocket(`${INSTANCE_URL}/api/v1/streaming?stream=user`, {
                    headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
                });

                this.ws.on('open', () => {
                    console.log('WebSocket connection established to user stream');
                });

                this.ws.on('message', (data) => {
                    const parsedData = JSON.parse(data);
                    
                    if (parsedData.event === 'update') {
                        try {
                            const payloadData = JSON.parse(parsedData.payload)
                            const processedMessage = this.removeHtmlTags(payloadData.content);
                            
                            
                            let yukonMessage = processedMessage;
                            
                            if (processedMessage.startsWith("Human Readable title")) {
                                // Split the string by lines
                                const lines = processedMessage.split(';;;');
                                if (lines.length == 1) {
                                    console.error("Got a message with a human readable part, but no ;;; delimiter")
                                    return
                                }
                                if (lines.length > 2) {
                                    console.warn('Message has more parts than expected')
                                }
                                
                                // Extract the first line (the title)
                                const hr = lines[0];
                                // Overwrite yukonMessage with the rest of the message (excluding the first line)
                                yukonMessage = lines[1];
                            }
                            yukonMessage = this.removeHtmlTags(yukonMessage)
                            yukonMessage = htmlEntities.decode(yukonMessage)
                            
                            if (yukonMessage.startsWith('{')) {
                                // Step 4: Parse the JSON string into a JavaScript object
                                const originalMessage = JSON.parse(yukonMessage);
                                this.handleFederatedGameEvent(originalMessage)
                            }
                        } catch (error) {
                            console.log("Error processing update message:", error)
                        }
                    } else if (parsedData.event === 'notification') {
                        // Use a reviver function to extract only the "type" field
                        const payload = JSON.parse(this.removeHtmlTags(parsedData.payload))
                        
                        if (payload.type === 'follow') {
                            const parsedUrl = new URL(payload.account.url);
                            const serverInstance = parsedUrl.host; // Base URL
                            const user = parsedUrl.pathname.substring(1); // Path
                            this.onNewFollow(user, serverInstance)
                        }
                    }
                });

                this.ws.on('error', (err) => {
                    console.error('WebSocket error:', err);
                });

                this.ws.on('close', () => {
                    console.log('WebSocket connection closed');
                });
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    }
    
    async close() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close(1000, 'Client is closing the connection'); // 1000 is the normal closure code
            console.log('WebSocket connection is closing...');
        } else {
            console.log('WebSocket is not open or already closed.');
        }
        
        if (this.dbConnection) {
            try {
                await this.dbConnection.end();
                console.log('Database connection closed.');
            } catch (error) {
                console.error('Error closing database connection:', error);
            }
        } else {
            console.log('No database connection to close.');
        }
        this.mastodonPostingClient = null;
        this.dbConnection = null;
        this.ws = null
    }
    
    makeHumanReadableTitle(message) {
        const username = message.user.username;
        let userMessage = 'something';

        switch (message.action) {
            case 'send_position':
                return `${username} moved`;
            case 'join_room':
                return `${username} joined a room`;
            case 'snowball':
                return `${username} threw a snowball`;
            case 'send_message':
                userMessage = message.args.message;
            case 'send_safe':
                // Putting quotation marks breaks things?
                return `${username} said: ${userMessage}`;
            case 'send_emote':
                return `${username} sent an emoji`;
            case 'send_frame':
                return `${username} did a pose`;
            default:
                return `${username} performed an unknown action`;
        }
    }


    async federateMessage(message) {
        try {
            const hr = this.makeHumanReadableTitle(message)
            await this.mastodonPostingClient.v1.statuses.create({
                status: `Human Readable title: ${hr};;;` + JSON.stringify(message),
                visibility: 'unlisted'
            });
        } catch (error) {
            console.error('Error federating message:', error);
        }
    }

    generateReadablePassword() {
        return randomWords({ exactly: 1, wordsPerString: 1 })[0];
    }
}
