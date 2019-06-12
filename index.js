const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
// const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');
const {agent} = require('./controllers/agent');
const {frontend} = require('./client/widget');
const {runCRON, updatePersonIds} = require('./cron/update-lookup');
const {getIdByName} = require('./intenthandling/staticdata');

const server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.get('/', (req, res) => {
    res.send(frontend());
});
server.post('/orf-data', (request, response) => agent(request, response));

// runCRON();
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));