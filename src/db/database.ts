'use strict';
import { dbInfo } from '../config/config'
import * as mysql from 'mysql';

let con = mysql.createConnection({
    host: dbInfo.dbHost,
    user: dbInfo.dbUserName,
    password: dbInfo.dbPassword,
    database: dbInfo.dbName
});

export function connect() {
    return con.connect(function (err) {
        if (err) throw err;
        console.log('Connected to DB.');
    });
}

export function createUserTable() {
    let sql = "CREATE TABLE userdata (teleid VARCHAR(255), watchlist VARCHAR(255), blacklist VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('created main table');
    });
}
/**
 * Add a user to the DB, watchlist and blacklist are CSVs
 * @export
 * @param {number} teleid 
 * @param {string} watchlist 
 * @param {string} blackList 
 */
export function addUser(teleid: number, watchlist: string, blackList: string) {
    var sql = `INSERT INTO userdata (teleid, watchlist, blacklist) VALUES ('${teleid}', '${watchlist}', '${blackList}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`Created new user with ID: ${teleid} and a watchlist of ${watchlist}`);
    });
}

export function modifyUser() {

}

export function removeUser() {

}

export function getUserDataByID() {

}
/**
 * 
 * 
 * @export
 * @returns {Promise}
 */
export function getAllUserData() {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM userdata`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length < 1) {
                return reject(`No user info found`);
            } else {
                return resolve(result);
            }
        });
    });
}
