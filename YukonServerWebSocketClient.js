import WebSocket from 'ws';

export default class YukonServerWebSocketClient {
    constructor(url) {
        this.client = new WebSocket(url);
        
    }
    
    connect() {
        this.client.on('open', () => {
            console.log('Connected to WebSocket server');
        });

        this.client.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.client.on('close', (code, reason) => {
            console.log(`WebSocket connection closed: ${code} - ${reason}`);
        });
    }

    emit(event, data) {
        const message = JSON.stringify({ event, data });
        this.client.send(message);
    }

    sendMessageToYukonServer(message) {
        this.emit('message', message);
    }
}
