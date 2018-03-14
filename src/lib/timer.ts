'use strict';
let start = process.hrtime();

export function elapsedTime(message: string) {
    var precision: number = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + message); // print message + time
    start = process.hrtime(); // reset the timer
}