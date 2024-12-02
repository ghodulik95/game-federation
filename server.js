const express = require('express');
const app = express();
app.use(express.json());


const WebSocket = require('ws');

// Connect to the WebSocket server
const client = new WebSocket('ws://localhost:3001');

// Handle connection open event
client.on('open', () => {
    console.log('Connected to WebSocket server');
    // Send a message to the server
    //client.send('Hello, server!');
});

// Handle messages from the server
client.on('message', (message) => {
    console.log('Message from server:', message);
});

// Handle errors
client.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// Handle connection close event
client.on('close', (code, reason) => {
    console.log(`WebSocket connection closed: ${code} - ${reason}`);
});

function emit(ws, event, data) {
    ws.send(JSON.stringify({ event, data }));
}

function sendMessageToHttpServer(message) {
    emit(client, 'message', message)
    //client.emit('message',  message)
    console.log("Sending received toot to client")
    /*
    console.log(message)
    console.log(JSON.stringify(message))
    fetch('http://127.0.0.1:3001', {
        method: 'POST', // Change to GET, PUT, DELETE as needed
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    .then((response) => "Got response") // Parse JSON response
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
}

// Listen for toots
// TODO: Actually listen for toots rather than just getting called directly
function onFollowingToot(message) {
    
    console.log("Received message from stream")
    console.log(message)
    sendMessageToHttpServer(message)
}

function federate(message) {
    // federaterFactory?
    // Connect to Mastodon API
    // [Handled before this] If related to game auth and joining a server
    
    // Send message out as toot
    // TODO: actually do this
    onFollowingToot(message)
}

function onReceiveEmit(message) {
    console.log("Federating...")
    console.log(message)
    federate(message)
    
}

// Route to handle a POST request
app.post('/emit-federated', (req, res) => {
    console.log('Received data:', req.body);
    
    onReceiveEmit(req.body)
    
    res.json({ message: 'Data received', data: req.body });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
