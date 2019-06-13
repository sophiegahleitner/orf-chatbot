const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';
const mysql = require('mysql');

const dburl = 'eu-cdbr-west-02.cleardb.net';
const dbusername = 'b28f3fe203bde0';
const dbpw = '5c818038';
const dbname = 'heroku_384ac690adcffdc';



export function getPersonData(name) {
    return getIdByName(name).then((id) => {
            return new Promise((resolve, reject) => {
                axios.get(url + '/person/' + id)
                    .then(resp => {console.log("resp");resolve(resp)})
                    .catch(resp => {console.log("in");reject(resp)});
            })
        })
        .catch(err => {
            console.log("in catch");
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


export function getRecordWinner(compId, discId, genId, locId, number = 5) {
    return new Promise((resolve, reject) => {
        axios.get(url + '/best?CompetitionId=' + compId + '&DisciplineId=' + discId + '&GenderId=' + genId + '&LocationId=' + locId + '&TopItems=' + number)
            .then(resp => resolve(resp))
            .catch(resp => reject(resp));
    })
}

function getIdByName(name) {
    return new Promise(function (resolve, reject){
        console.log("Type:" + typeof (name) + ' Name: ' + name);
        let nameArray = name.match(/\S+/g);
        console.log(nameArray[0]);

        let sql = `SELECT * FROM persons WHERE firstname LIKE '${nameArray[0]}%' AND lastname LIKE '${nameArray[nameArray.length - 1]}%';`;

        let con = mysql.createConnection({
            host: dburl,
            user: dbusername,
            password: dbpw,
            database: dbname
        });

        con.connect(function (err) {
            // if (err) reject(err);
            con.query(sql, function (err, result) {
                if (err) return reject(err);
                if(err || result[0] == null|| result[0].orf_id ===undefined||result[0]===undefined){
                    reject("Person wurde nicht gefunden.");
                }
                else{
                    resolve(result[0].orf_id);
                }
            });
            con.end();

        });
    });
}