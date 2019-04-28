const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const server = express();
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', (req, res) => res.send('page'));
server.post('/orf-data', (req, res) => {
    const agent = new WebhookClient({ req, res });
console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

function welcome(agent) {
    agent.add(`Willkommen zum ORF Chatbot!`);
}

function fallback(agent) {
    agent.add(`Das habe ich nicht verstanden`);
}

let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
// intentMap.set('your intent name here', yourFunctionHandler);
// intentMap.set('your intent name here', googleAssistantHandler);
agent.handleRequest(intentMap);
});


server.listen(PORT, () => console.log(`Listening on ${ PORT }`));