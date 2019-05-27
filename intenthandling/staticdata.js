const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';

export function getPersonData(id){
        return new Promise((resolve, reject)=> {
            axios.get(url+'/person/'+id)
                .then(resp => resolve(resp))
                .catch(resp => reject(resp));
        })
}


export function getRecordWinner(compId, discId, genId, locId, number = 5){
    return new Promise((resolve, reject)=> {
        axios.get(url+'/best?CompetitionId='+compId+'&DisciplineId='+discId+'&GenderId='+genId+'&LocationId='+locId+'&TopItems='+number)
            .then(resp => resolve(resp))
            .catch(resp => reject(resp));
    })
}
