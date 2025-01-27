import WebSocket from 'ws';
import GameServerEventEmitter from './GameServerEventEmitter.js';

export default class YukonServerEventEmitter extends GameServerEventEmitter {
    constructor(url) {
        super(url);
        this.client = null;
    }
    
    start() {
        console.log(this.url)
        this.client = new WebSocket(this.url);
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
    
    close() {
        if (this.client && this.client.readyState === WebSocket.OPEN) {
            this.client.close(1000, 'Client closing connection'); // 1000 is the normal closure code
            console.log('WebSocket connection is closing...');
        } else {
            console.log('WebSocket is not open or already closed.');
        }
    }

    emit(event, data) {
        const message = JSON.stringify({ event, data });
        this.client.send(message);
    }
    
    emitCallback() {
        return (message) => this.emit('message', message);
    }
}
