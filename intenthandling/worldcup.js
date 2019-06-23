const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';
const iso = require('i18n-iso-countries');

/**
 * @param gender
 * @param discipline
 * @param pos
 * @returns {Promise<any>}
 */
export function getWorldCupStatus(gender, discipline, pos) {
  return new Promise((resolve, reject) => {
    getWorldCupRanking(gender, discipline)
      .then((res) => {
        resolve({
            cup: res.cup,
            athlete: res.rankings[pos - 1]['FirstName'] + ' ' + res.rankings[pos - 1]['LastName'],
            nation: getNationOfAlphaCode(res.rankings[pos - 1]['NationCC3']),
            points: res.rankings[pos - 1]['Value'],
            position: pos,
            description: res.description
          }
        );
      })
      .catch(err => {
        reject(err);
      })
  });
}

/**
 * @param gender
 * @param discipline
 * @returns {Promise<any>}
 */
export function getWorldCupRanking(gender, discipline) {
  let id = getCupId(gender, discipline);
  return new Promise((resolve, reject) => {
    axios.get(url + '/cuprankings/' + id)
      .then((res) => {
        resolve({
          cup: res.data['RankingName'],
          rankings: res.data['PersonRankings'],
          description: res.data['RankingDescription']
        });
      })
      .catch(resp => {
        reject(resp);
      })
  });
}

/**
 * @param gender
 * @param discipline
 * @returns int cupId
 */
function getCupId(gender, discipline) {
  const lookup = {
    1: {0: 4, 1: 5, 2: 6, 3: 7, 4: 8, 5: 9},
    2: {0: 10, 1: 11, 2: 12, 3: 13, 4: 14, 5: 15}
  };
  return lookup[gender][discipline];
}

/**
 * @param code
 * @returns {string}
 */
function getNationOfAlphaCode(code) {
  return iso.getName(code, 'de');
}
