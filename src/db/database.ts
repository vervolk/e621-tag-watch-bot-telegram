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

export function addUser() {

}

export function modifyUser() {

}

export function removeUser() {

}

export function getUserDataByID() {

}
