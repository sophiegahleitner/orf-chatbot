const axios = require('axios');
const url = 'https://appfeeds.orf.at/alpine.v2/api';


/**
 *
 * @param id
 * @returns {Promise}
 */
export function getFanfact(id = 0) {
    return new Promise((resolve, reject) => {
        axios.get(url + '/fanfacts')
            .then((res) => {
                if(id >= res.data.length){
                    reject(new Error("Leider haben wir nicht mehr Fan-Fakten"));
                }
                resolve({
                    headline: res.data[id].Title,
                    content: res.data[id].Content
                })
            })
            .catch((rej) => {
                reject(rej)
            });
    })
}