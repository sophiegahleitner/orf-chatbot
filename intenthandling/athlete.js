const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';
const iso = require('i18n-iso-countries');

import {getAthleteIdByName} from './helper-functions';

/**
 * @param name
 * @returns {Promise<any>}
 */
export function getAge(name) {
  return new Promise((resolve, reject) => {
    getAthleteDataByName(name)
      .then((res) => {
        resolve({
            age: res.data['Age'],
            firstname: capitalizeFirstLetter(getFirstName(name)),
            lastname: capitalizeFirstLetter(getLastName(name))
          }
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @param name
 * @returns {Promise<any>}
 */
export function getHeight(name) {
  return new Promise((resolve, reject) => {
    getAthleteDataByName(name)
      .then((res) => {
        resolve({
            height: centimeterToMeter(res.data['Height']),
            firstname: capitalizeFirstLetter(getFirstName(name)),
            lastname: capitalizeFirstLetter(getLastName(name))
          }
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @param name
 * @returns {Promise<any>}
 */
export function getNation(name) {
  return new Promise((resolve, reject) => {
    getAthleteDataByName(name)
      .then((res) => {
        resolve({
            nation: getNationOfAlphaCode(res.data['NationName']),
            firstname: capitalizeFirstLetter(getFirstName(name)),
            lastname: capitalizeFirstLetter(getLastName(name))
          }
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @param name
 * @returns {Promise<any>}
 */
function getAthleteDataByName(name) {
  let firstName = getFirstName(name);
  let lastName = getLastName(name);

  return getAthleteIdByName(firstName, lastName)
    .then((id) => {
      return new Promise((resolve, reject) => {
        axios.get(url + '/person/' + id)
          .then((res) => {
            resolve(res)
          })
          .catch((rej) => {
            console.log("in");
            reject(rej)
          });
      })
    })
    .catch((err) => {
        return new Promise((resolve, reject) => {
          if (err.message === "Person wurde nicht gefunden.") {
            reject(err);
          }
          else {
            console.log("reject: " + err);
            reject(new Error('Unbekannter Fehler: ' + err.message))
          }
        })
      }
    );
}

/**
 * @param name
 * @returns {string}
 */
function getFirstName(name) {
  let names = name.toLowerCase().match(/\S+/g);
  return names[0];
}

/**
 * @param name
 * @returns {string}
 */
function getLastName(name) {
  let names = name.toLowerCase().match(/\S+/g);
  return names[names.length - 1];
}

/**
 * @param string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function centimeterToMeter(value) {
  return value / 100;
}

/**
 * @param code
 * @returns {string}
 */
function getNationOfAlphaCode(code) {
  return iso.getName(code, 'de');
}
