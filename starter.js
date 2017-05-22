#!/usr/bin/env node
"use strict";
const program = require('commander'),
    packageJson = require('./package.json'),
    chalk = require('chalk'),
    figlet = require('figlet'),
    shell = require('./command'),
    fs = require('fs'),
    fo = require('./file'),
    parser = require('./parser'),
    constant = require('./constant');

program
    .version(packageJson.version);

program
    .command('run')//file and path is optional params
    .description('Start jar files with specific options')
    .option("-f,--file [file]", "Configuration file for startup")
    .action((options) => {
        console.log(chalk.yellow(figlet.textSync('Sisley!', {
            font: 'ghost',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted'
        })));


        fo.search(options).then(parser.parse).then(shell.execute).then((pids) => {
            for (let i = 0; i < pids.length; i++) {
                let pid = String(pids[i]);
                let last = pids.length - 1;
                if (!(last === i)) {
                    pid += '-';
                }
                fo.logToFile(constant.PROCESS_LOG_PATH, pid);
            }
        })
            .catch(err => {
                console.log(`Error occured!. Reason :  ${err.reason}  Message : ${err.message}`);
                process.exit();
            });
    });


program
    .command('stop')//file and path is optional params
    .description('Stop running applications')
    .action(() => {
        console.log(chalk.yellow(figlet.textSync('Sisley!', {
            font: 'ghost',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted'
        })));


        let content = fs.readFileSync(constant.PROCESS_LOG_PATH, {
            encoding: 'utf8'
        });

        let pids = content.split('-');
        pids.forEach((pid) => {
            console.log(`Stopping pid is : ${pid}`);
            process.kill(pid);
        });

        fs.unlink(constant.PROCESS_LOG_PATH);
        fs.unlink(constant.APP_LOG_PATH);
        fs.unlink(constant.MVN_LOG_PATH);
    });


program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

