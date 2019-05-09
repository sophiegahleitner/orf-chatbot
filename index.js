const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {agent} = require('./controllers/agent');
const {frontend} = require('./client/widget');

const server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.get('/', (req, res) => {
    let frontend = '<iframe allow="microphone;" width="350" height="430" src="https://console.dialogflow.com/api-client/demo/embedded/d069c269-2570-4139-a93a-7b10375048d7">  </iframe>';
    res.send(frontend);
    // res.send(frontend());
});
server.post('/orf-data', (request, response) => agent(request, response));

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));