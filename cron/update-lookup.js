const cron = require("node-cron");
const axios = require('axios');
const mysql = require('mysql');
const fs = require('fs');

const dburl = 'eu-cdbr-west-02.cleardb.net';
const dbusername = 'b28f3fe203bde0';
const dbpw = '5c818038';
const dbname = 'heroku_384ac690adcffdc';

const url = 'https://appfeeds.orf.at/alpine.v2/api';

export function runCRON() {
    cron.schedule("* * * * * *", function () {
        console.log("running a task every second");
        updatePersonIds();

    });
}

export function updatePersonIds(){
    axios.get(`${url}/person`).then(resp => {

        let sql = `INSERT INTO persons(firstname, lastname, orf_id)
           VALUES`;
        getLastID('persons')
            .then((result)=>{
                let updated = false;
                resp.data.forEach(function (item, key) {
                    if(!(item.PersonId <= result)) {
                        // console.log("res"+result.LastID );
                        sql += ` ("${clearstring(item.FirstName)}", "${clearstring(item.LastName)}", ${clearstring(item.PersonId)}),`
                        updated = true;
                    }
                });


                sql = sql.slice(0, -1);
                if(updated)execSQL(sql);
        })
            .catch((err)=>{
            console.log(err);
            });



    });
    // getAllPersons();
}
function clearstring(str){
    if(typeof (str)==="string") {
        let cleanstr =  str.replace(/['"]+/g, '');
        return cleanstr;
    }
    else
        return str;

}



function execSQL(sql){
    let con = mysql.createConnection({
        host: dburl,
        user: dbusername,
        password: dbpw,
        database: dbname
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

// execute the insert statment
    con.query(sql);

    con.end();
    console.log("conn closed");
}

function getLastID(tablename){

    return new Promise(function(resolve, reject){
        let sql = `SELECT MAX(orf_id) AS LastID FROM ${tablename}`;

        let con = mysql.createConnection({
            host: dburl,
            user: dbusername,
            password: dbpw,
            database: dbname
        });
        con.connect(function(err) {
            if (err) reject(err);
            con.query(sql, function (err, result) {
                if (err) return reject(err);
                resolve(result[0].LastID);
            });
            con.end();

        });
    });

}
