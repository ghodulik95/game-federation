import ProjectExecutor from './ProjectExecutor.js';
import MockFederationService from './MockFederationService.js';
import YukonServerWebSocketClient from './YukonServerWebSocketClient.js';
import YukonServerEventListener from './YukonServerEventListener.js';

// Define ports
const yukonServerPort = 3001;
const yukonListenerPort = 3000;

// Initialize WebSocket client
const wsClient = new YukonServerWebSocketClient(`ws://localhost:${yukonServerPort}`);

const eventListener = new YukonServerEventListener(yukonListenerPort);

// Initialize the concrete federation service
const federationService = new MockFederationService(wsClient);

// Execute the project
const project = new ProjectExecutor(wsClient, eventListener, federationService);
project.run();
