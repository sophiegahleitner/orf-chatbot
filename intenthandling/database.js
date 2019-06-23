const mysql = require('mysql');

const DB_URL = 'eu-cdbr-west-02.cleardb.net';
const DB_NAME = 'heroku_384ac690adcffdc';
const DB_USER = 'b28f3fe203bde0';
const DB_PASSWORD = '5c818038';

export class Database {

  constructor() {
    this.con = mysql.createConnection({
      host: DB_URL,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });
  }

  getIdByName(firstname, lastname) {
    let sql = `SELECT * FROM persons WHERE firstname LIKE '${firstname}%' AND lastname LIKE '${lastname}%';`;
    return new Promise((resolve, reject) => {
      this.con.connect((error) => {
        if (error) {
          reject(new Error('Es konnte keine Verbindung zur Datenbank hergestellt werden.'));
        }
      });
      this.con.query(sql, (error, results) => {
        if (error) {
          this.con.end();
          reject(new Error('Datenbankabfrage ist fehlgeschlagen.'));
        }

        if (results !== null && results !== undefined && results[0] !== null && results[0] !== undefined && results[0].orf_id !== undefined) {
          this.con.end();
          resolve(results[0].orf_id);
        } else {
          this.con.end();
          reject(new Error('Person wurde nicht gefunden.'));
        }
      });
    });
  }
}
