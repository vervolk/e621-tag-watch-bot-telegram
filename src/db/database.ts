'use strict';
import { dbInfo } from '../config/config'
import * as mysql from 'mysql';

export interface userSingleRow {
    teleid: number
    watchlist: string
    blacklist: string
}

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

/**
 * This is where we create the user table, running this DELETES old data if run more than once
 */
export function createUserTable() {
    let sql = "CREATE TABLE userdata (teleid VARCHAR(255), watchlist VARCHAR(255), blacklist VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('created main table');
    });
}

/**
 * Add a user to the DB, watchlist and blacklist are CSVs
 * @param {number} teleid 
 * @param {string} watchlist 
 * @param {string} blackList 
 */
export function addUser(teleid: number, watchlist: string, blackList: string) {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO userdata (teleid, watchlist, blacklist) VALUES ('${teleid}', '${watchlist}', '${blackList}')`;
        con.query(sql, function (err, result) {
            if (err) return reject(err);
            console.log(`Created new user with ID: ${teleid} and a watchlist of ${watchlist}`);
            return resolve(result);
        });
    })
}

export function modifyUser(teleid: number, watchlist?: string, blacklist?: string) {

}

export function removeUser(teleid: number) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM userdata WHERE teleid = '${teleid}'`;
        con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

export function getUserDataByID(teleid): Promise<userSingleRow> {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM userdata WHERE teleid = '${teleid}'`;
        con.query(sql, function (err, result: userSingleRow[]) {
            if (err) throw err;
            if (result.length < 1) {
                return reject(`No user was found with the ID ${teleid}`);
            } else if (result.length > 1) {
                return reject(`Multiple users found with the ID ${teleid} (CORRUPTION WARNING)`);
            } else {
                console.log(`Found ID in database: ${result[0].teleid}`);
                return resolve(result[0]);
            }
        });
    });
}

/**
 * Get ALL user data in an array
 * @export
 * @returns {Promise}
 */
export function getAllUserData(): Promise<userSingleRow[]> {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM userdata`;
        con.query(sql, function (err, result: userSingleRow[]) {
            if (err) throw err;
            if (result.length < 1) {
                return reject(`No user info found`);
            } else {
                return resolve(result);
            }
        });
    });
}