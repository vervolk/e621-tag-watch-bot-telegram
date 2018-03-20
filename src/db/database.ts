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
