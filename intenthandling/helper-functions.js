const mysql = require('mysql');

const dburl = 'eu-cdbr-west-02.cleardb.net';
const dbusername = 'b28f3fe203bde0';
const dbpw = '5c818038';
const dbname = 'heroku_384ac690adcffdc';



export function getIdByName(name) {
    return new Promise(function (resolve, reject){
        console.log("Type:" + typeof (name) + ' Name: ' + name);
        name = name.toLowerCase();
        let nameArray = name.match(/\S+/g);

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

export function getCupId(gender, discipline){
    console.log(gender);
    console.log(discipline);
    const lookup = {
        1: {0:4,1:5, 2:6, 3:7, 4:8, 5:9}, //herren
        2: {0:10, 1:11, 2: 12, 3:13, 4:14, 5:15} //damen
    };
    let cupid = lookup[gender][discipline];
    return cupid;

}