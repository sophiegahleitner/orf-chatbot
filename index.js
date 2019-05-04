const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const server = express();
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json());

server.get('/', (req, res) => {
let frontend = '<iframe allow="microphone;" width="350" height="430" src="https://console.dialogflow.com/api-client/demo/embedded/d069c269-2570-4139-a93a-7b10375048d7">  </iframe>';
    res.send(frontend);
});
server.post('/orf-data', (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Willkommen zum ORF Bot!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    function sendAthleteAge(agent) {
      agent.add(agent.parameters.athletename +` ist 20 Jahre alt.`);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ORF.athlete.age', sendAthleteAge);
    agent.handleRequest(intentMap);
});
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));