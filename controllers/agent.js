const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');
import * as staticdata from '../intenthandling/staticdata';

const iso = require('iso-3166-1');


export function test() {
    console.log("test");
}

export function agent(request, response) {
    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Willkommen zum ORF Bot!`);
    }

    function fallback(agent) {
        agent.add(`Ich kann das nicht verstehen.`);
        agent.add(`Kannst du das bitte wiederholen?`);
    }

    function sendAthleteAge(agent) {
        return staticdata.getPersonData(agent.parameters.athletename)
            .then(resp => {
                agent.add(agent.parameters.athletename + ` ist ${resp.data.Age} Jahre alt.`);
            })
            .catch(res => {
                console.log("Agent:" + res);
                agent.add("Es ist folgender Fehler aufgetreten: " + res);
            });
    }

    function sendAthleteHeight(agent) {
        return staticdata.getPersonData(agent.parameters.athletename)
            .then(resp => {
                console.log(agent.parameters.athletename);
                agent.add(agent.parameters.athletename + ` ist ${resp.data.Height} Zentimeter groß.`);
            })
            .catch(res => {
                console.log("Agent:" + res);
                agent.add("Es ist folgender Fehler aufgetreten: " + res);
            });
    }

    function sendAthleteNation(agent) {
        return staticdata.getPersonData(agent.parameters.athletename)
            .then(resp => {
                let nation = iso.whereAlpha3(resp.data.NationName);
                agent.add(agent.parameters.athletename + ` ist von ${nation} .`);
            })
            .catch(res => {
                console.log("Agent:" + res);
                agent.add("Es ist folgender Fehler aufgetreten: " + res);
            });
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ORF.athlete.age', sendAthleteAge);
    intentMap.set('ORF.athlete.height', sendAthleteHeight);
    intentMap.set('ORF.athlete.nation', sendAthleteNation);
    // intentMap.set('ORF.athlete.weight', sendAthleteWeight);
    // intentMap.set('ORF.athlete.equipment', sendAthleteEquipment);
    agent.handleRequest(intentMap);
    return agent;
}

