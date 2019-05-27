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
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function sendAthleteAge (agent) {
        let id = 4623;
        return staticdata.getPersonData(id).then(resp => {
                agent.add(agent.parameters.athletename +` ist ${resp.data.Age} Jahre alt.`);
            })
            .catch(res => {
                agent.add(res);

            });
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ORF.athlete.age', sendAthleteAge);
    agent.handleRequest(intentMap);
    return agent;
}

