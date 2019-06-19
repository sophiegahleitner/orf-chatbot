const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';
import * as helper from './helper-functions';


export function getPersonData(name) {
    return helper.getIdByName(name)
        .then((id) => {
            return new Promise((resolve, reject) => {
                axios.get(url + '/person/' + id)
                    .then(resp => {console.log("resp");resolve(resp)})
                    .catch(resp => {console.log("in");reject(resp)});
            })
        })
        .catch(err => {
            return new Promise((resolve, reject) => {
                if(err ==="Person wurde nicht gefunden.") {
                    reject(err);
                }
                else{
                    reject("Unbekannter Fehler: "+err)
                }
            })
            }

        );
}

export function getWorldcupRanking(discipline, gender) {
    let id = helper.getCupId(gender, discipline);
    console.log("getworldcupid:" +id);
    return new Promise((resolve, reject) => {
        axios.get(url + '/cuprankings/' + id)
            .then(resp =>{
                resolve(resp);
            })
            .catch(resp => {
                console.log(resp);
                reject(resp);
            })
    })
}



export function getRecordWinner(compId, discId, genId, locId, number = 5) {
    return new Promise((resolve, reject) => {
        axios.get(url + '/best?CompetitionId=' + compId + '&DisciplineId=' + discId + '&GenderId=' + genId + '&LocationId=' + locId + '&TopItems=' + number)
            .then(resp => resolve(resp))
            .catch(resp => reject(resp));
    })
}

