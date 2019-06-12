const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');
import * as staticdata from '../intenthandling/staticdata';


export function test(){
    console.log("test");
}

export function agent(request, response){
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Willkommen zum ORF Bot!`);
    }

    function fallback(agent){
        agent.add(`Ich kann das nicht verstehen.`);
        agent.add(`Kannst du das bitte wiederholen?`);
    }

    function sendAthleteAge (agent, ) {
        return staticdata.getPersonData(agent.parameters.athletename )
            .then(resp => {
            agent.add(agent.parameters.athletename +` ist ${resp.data.Age} Jahre alt.`);
        })
            .catch(res => {
                console.log("Agent:"+ res);
                agent.add("Es ist folgender Fehler aufgetreten: "+res);
            });
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ORF.athlete.age', sendAthleteAge);
    agent.handleRequest(intentMap);
    return agent;
}

