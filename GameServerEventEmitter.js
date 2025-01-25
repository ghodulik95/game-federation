export default class GameServerEventEmitter {
    constructor(url) {
        if (new.target === GameServerEventEmitter) {
            throw Error('Cannot initialize GameServerEventEmitter directly');
        }
        this.url = url;
    }
    
    async start() {
        throw new Error('start must be implemented');
    }

    async close() {
        throw new Error('close must be implemented');
    }
    
    emitCallback() {
        throw new Error('getCallback must be implemented');
    }
}
