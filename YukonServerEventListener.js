import express from 'express';
import GameServerEventListener from './GameServerEventListener.js';

export default class YukonServerEventListener extends GameServerEventListener {
    constructor(port) {
        super(port)
        this.server = null;
        this.app = null;
        
    }

    start() {
        this.app = express();

        this.app.use(express.json());

        this.app.post('/', (req, res) => {
            this.onReceiveMessage(req.body);

            res.json({ message: 'Data received', data: req.body });
        });
        this.server = this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }

    close() {
        if (this.server) {
            this.server.close(() => {
                console.log(`Server on http://localhost:${this.port} has been closed`);
            });
            this.server = null;
        } else {
            console.log('No server is currently running to close.');
        }
    }
}
