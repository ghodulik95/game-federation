import express from 'express';

export default class YukonServerEventListener {
    constructor(port, federationService) {
        this.app = express();
        this.port = port;
        this.federationService = null;

        this.app.use(express.json());

        this.app.post('/', (req, res) => {
            if (!this.federationService) {
                console.error("Federation service not set up. Cannot federate event.")
                return
            }
            this.federationService.handleReceiveMessageFromYukonServer(req.body);

            res.json({ message: 'Data received', data: req.body });
        });
    }
    
    setFederationService(federationService) {
        this.federationService = federationService
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}
