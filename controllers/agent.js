const {WebhookClient} = require('dialogflow-fulfillment');
import * as athlete from '../intenthandling/athlete.js';
import * as worldcup from '../intenthandling/worldcup.js';

/**
 * @param request
 * @param response
 * @returns {*}
 */
export function agent(request, response) {
    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    /**
     * @param agent
     */
    function welcome(agent) {
        agent.add(`Willkommen zum ORF Bot! Sie können beispielsweise nach Infos zu Sportlerinnen und Sportler fragen oder sich über Zwischenstände in Weltcups informieren.`);
    }

    /**
     * @param agent
     */

    function fallback(agent) {
        agent.add(`Ich kann das nicht verstehen. Sie können beispielsweise nach dem Alter einer Person fragen oder den Zwischenständen in Weltcups fragen.`);
        agent.add('Leider habe ich deine Frage nicht verstanden. Du kannst mich gerne nach dem derzeitigen Stand im Weltcup fragen.');
        agent.add('Leider kann ich deine Frage nicht beantworten. Du kannst mich gerne nach dem derzeitigen Stand im Weltcup fragen.');
    }

    /**
     * @param agent
     * @returns {Promise<any>}
     */
    function sendAthleteAge(agent) {
        return athlete.getAge(agent.parameters['athletename'])
            .then(res => {
                agent.add(`${res['firstname']} ${res['lastname']} ist ${res['age']} Jahre alt.`);
            })
            .catch(err => {
                agent.add("Es ist folgender Fehler aufgetreten: " + err.message);
            });
    }

    /**
     * @param agent
     * @returns {Promise.<any>}
     */
    function sendAthleteAgeFromContext(agent) {
        if(agent.contexts.length > 0 && agent.contexts[0].parameters['athletename'] === "string"){
            agent.parameters['athletename'] = agent.contexts[0].parameters['athletename'];
            return sendAthleteAge(agent);
        }
        else{
            agent.add("Bitte stellen Sie die Frage inklusive Namen noch einmal.");
        }
    }

    /**
     * @param agent
     * @returns {Promise.<any>}
     */
    function sendAthleteNationFromContext(agent) {
        if(agent.contexts.length > 0 && agent.contexts[0].parameters['athletename'] === "string"){
            agent.parameters['athletename'] = agent.contexts[0].parameters['athletename'];
            return sendAthleteNation(agent);
        }
        else{
            agent.add("Bitte stellen Sie die Frage inklusive Namen noch einmal.");
        }
    }

    /**
     * @param agent
     * @returns {Promise<any>}
     */
    function sendAthleteHeight(agent) {
        return athlete.getHeight(agent.parameters['athletename'])
            .then(res => {
                agent.add(`${res['firstname']} ${res['lastname']} ist ${res['height']} m groß.`);
            })
            .catch(err => {
                agent.add("Es ist folgender Fehler aufgetreten: " + err.message);
            });
    }

    /**
     * @param agent
     * @returns {Promise<any>}
     */
    function sendAthleteNation(agent) {
        return athlete.getNation(agent.parameters['athletename'])
            .then(res => {
                agent.add(`${res['firstname']} ${res['lastname']} ist von ${res['nation']}.`);
            })
            .catch(err => {
                agent.add("Es ist folgender Fehler aufgetreten: " + err.message);
            });
    }

    /**
     * @param agent
     * @returns {Promise.<TResult>}
     */
    function sendWorldcupRanking(agent) {
        return worldcup.getWorldCupStatus(agent.parameters['gender'], agent.parameters['discipline'], agent.parameters['ranking'])
            .then(res => {
                agent.add(`Im ${res['cup']} ist ${res['athlete']} aus ${res['nation']} mit ${res['points']} Punkten auf Platz ${res['position']} (${res['description']}).`);
            })
            .catch(err => {
                agent.add("Es ist folgender Fehler aufgetreten: " + err.message);
            });
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('ORF.athlete.age', sendAthleteAge);
    intentMap.set('ORF.athlete.age.context', sendAthleteAgeFromContext);
    intentMap.set('ORF.athlete.height', sendAthleteHeight);
    intentMap.set('ORF.athlete.nation', sendAthleteNation);
    intentMap.set('ORF.athlete.nation.context', sendAthleteNationFromContext);
    intentMap.set('ORF.worldcup.status', sendWorldcupRanking);
    // intentMap.set('ORF.athlete.weight', sendAthleteWeight);
    // intentMap.set('ORF.athlete.equipment', sendAthleteEquipment);
    agent.handleRequest(intentMap);
    return agent;
}

