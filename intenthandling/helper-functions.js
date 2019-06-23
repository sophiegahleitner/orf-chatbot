import {Database} from "./database";

/**
 * @returns Promise<any>
 * @param firstname
 * @param lastname
 */
export function getAthleteIdByName(firstname, lastname) {
  return new Promise(function (resolve, reject) {
    let db = new Database();
    db.getIdByName(firstname, lastname)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}


