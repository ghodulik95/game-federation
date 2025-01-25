export default class GameServerEventListener {
    constructor(port) {
        if (new.target === GameServerEventListener) {
            throw new Error("Cannot instantiate abstract class GameServerEventListener directly.");
        }
        this.port = port;
        this.onReceiveMessage = (msg) => {};
    }
    
    setOnGameEvent(onReceiveMsg) {
        this.onReceiveMessage = onReceiveMsg;
    }

    async start() {
        throw new Error('start must be implemented');
    }

    async close() {
        throw new Error('close must be implemented');
    }
}
