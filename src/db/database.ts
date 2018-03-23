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

/**
 * Modify a user's set of tags on their watchlist (can be an add or remove operations)
 * @param {number} teleid User's Telegram ID
 * @param {string} watchlist modified watchlist
 * @returns 
 */
export function modifyUserWatchList(teleid: number, watchlist: string) {
    return new Promise((resolve, reject) => {
        var sql = `UPDATE userdata SET watchlist = '${watchlist}' WHERE teleid = '${teleid}'`;
        con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/**
 * Remove a user's data from the DB by their ID
 * @export
 * @param {number} teleid 
 * @returns {Promise<any> | Promise<mysql.MysqlError>}
 */
export function removeUser(teleid: number) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM userdata WHERE teleid = '${teleid}'`;
        con.query(sql, function (err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

/**
 * Get a user's DB data by their Telegram ID
 * @param {any} teleid User's Telegram ID
 * @returns {Promise<userSingleRow>} 
 */
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
        var sql = 'SELECT * FROM userdata';
        con.query(sql, function (err, result: userSingleRow[]) {
            if (err) throw err;
            if (result.length < 1) {
                return reject('No user info found');
            } else {
                return resolve(result);
            }
        });
    });
}