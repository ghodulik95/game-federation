import MastodonFederationService from './MastodonFederationService.js';
import YukonServerEventEmitter from './YukonServerEventEmitter.js';
import YukonServerEventListener from './YukonServerEventListener.js';
import config from './config.js';

const gameEmitter = new YukonServerEventEmitter(`ws://localhost:${config.yukonEmitterPort}`);
const gameListener = new YukonServerEventListener(config.yukonListenerPort);
const fedService = new MastodonFederationService(config.mastodonUrl);

// Set up callbacks
gameListener.setOnGameEvent(fedService.federateMessageCallback());
fedService.setOnFedEventReceived(gameEmitter.emitCallback());

// Start all services asynchronously
async function startServices() {
    try {
        await gameListener.start();
        console.log('GameListener started.');
        await gameEmitter.start();
        console.log('GameEmitter started.');
        await fedService.start();
        console.log('FederationService started.');
    } catch (err) {
        console.error('Error starting services:', err);
        await shutdown(); // Ensure graceful shutdown if startup fails
        process.exit(1);
    }
}

// Close all services asynchronously
async function shutdown() {
    console.log('\nShutting down gracefully...');
    try {
        if (gameListener) {
            await gameListener.close();
            console.log('GameListener stopped.');
        }
    } catch (err) {
        console.error('Error stopping GameListener:', err);
    }

    try {
        if (gameEmitter) {
            await gameEmitter.close();
            console.log('GameEmitter stopped.');
        }
    } catch (err) {
        console.error('Error stopping GameEmitter:', err);
    }

    try {
        if (fedService) {
            await fedService.close();
            console.log('FederationService stopped.');
        }
    } catch (err) {
        console.error('Error stopping FederationService:', err);
    }

    process.exit(0); // Exit the process after cleanup
}

// Handle process interrupts (e.g., Ctrl+C)
process.on('SIGINT', async () => {
    await shutdown();
});

// Optional: Handle other termination signals like SIGTERM
process.on('SIGTERM', async () => {
    await shutdown();
});

// Start the services
(async () => {
    await startServices();
})();
