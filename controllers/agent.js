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

  function welcome(agent) {
    agent.add(`Willkommen zum ORF Bot!`);
  }

  function fallback(agent) {
    agent.add(`Ich kann das nicht verstehen.`);
    agent.add(`Kannst du das bitte wiederholen?`);
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

  function sendWorldcupRanking(agent) {
    return worldcup.getWorldCupStatus(agent.parameters['gender'], agent.parameters['discipline'], agent.parameters['ranking'] )
      .then(res => {
        agent.add(`Im ${res['cup']} ist ${res['athlete']} aus ${res['nation']} mit ${res['points']} Punkten auf Platz ${res['pos']} (${res['description']}).`);
      })
      .catch(err => {
        agent.add("Es ist folgender Fehler aufgetreten: " + err.message);
      });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('ORF.athlete.age', sendAthleteAge);
  intentMap.set('ORF.athlete.height', sendAthleteHeight);
  intentMap.set('ORF.athlete.nation', sendAthleteNation);
  intentMap.set('ORF.worldcup.status', sendWorldcupRanking);
  // intentMap.set('ORF.athlete.weight', sendAthleteWeight);
  // intentMap.set('ORF.athlete.equipment', sendAthleteEquipment);
  agent.handleRequest(intentMap);
  return agent;
}

