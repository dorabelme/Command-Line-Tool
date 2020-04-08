#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

// Method #2
// const lstat = util.promisify(fs.lstat);

// Method #3
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();


fs.readdir(targetDir, async (err, filenames) => {
    // EITHER
    // err === an error object, which means something went wrong
    // OR
    // err === null, which means everything is OK

    if (err) {
        // error handling code here
        console.log(err);
    }

    // SOLUTION 3
    const statPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename));
    });

    const allStats = await Promise.all(statPromises);

    for (let stats of allStats) {
        const index = allStats.indexOf(stats);
        if (stats.isFile()) {
            console.log(filenames[index]);
        } else {
            console.log(chalk.blue(filenames[index]));
        }
    }

    // SOLUTION 2
    // for (let filename of filenames) {
    //     try {
    //         const stats = await lstat(filename);
    //         console.log(filename, stats.isFile());
    //     }
    //     catch {
    //         console.log(err);
    //     }
    // }

    // SOLUTION 1
    // const allStats = Array(filenames.length).fill(null);

    // for (let filename of filenames) {
    //     const index = filenames.indexOf(filename);
    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         allStats[index] = stats;

    //         const ready = allStats.every((stats) => {
    //             return stats;
    //         });

    //         if (ready) {
    //             allStats.forEach((stats, index) => {
    //                 console.log(filenames[index], stats.isFile());
    //             })
    //         }
    //     });
    // }
});


// Method #1
// const lstat = filename => {
//     return new Promise((resolve, reject) => {
//         fs.lstat(filename, (err, stats) => {
//             if (err) {
//                 reject(err);
//             }

//             resolve(stats);
//         });
//     });
// };

