const fs = require('fs'),
    constant = require('./constant/constant'),
    chalk = require('chalk'),
    fo = require('./file');
let shell = {
    pids: [],
    execute: function execute(microservices) {
        microservices.sort((i, j) => i.order - j.order);
        microservices.forEach((microservice) => {
            console.log(`Working on : ${microservice.name}`);
        let projectPath = microservice.projectPath;
        if (microservice.mvnOptions.build) {
            let command = 'mvn clean install';
            let arg = '';
            if (microservice.mvnOptions.skipTest) {
                arg += '-DskipTests=true';
                command += ' ' +arg;
            }
            console.log(`Project path :${projectPath}`);
            runSyncCommand(command, projectPath,arg);
        }


        projectPath = projectPath + '\\target';

        let fileName = fo.find(projectPath, '.jar');

        let args = ['-jar', fileName];

        if (microservice.runargs) {
            microservice.runargs.forEach(arg => args.push(arg));
        }
        runAsyncCommand(projectPath, args);
    });

        console.log(shell.pids.forEach((signal) => console.log(signal)));
        return Promise.resolve(shell.pids);
    }
};


function runSyncCommand(command, cwd,arg) {
    console.log(chalk.red(`Processing mvn command:  ${command}`));
    const child = require('child_process')
    let childProcess = child.spawnSync('cmd', ['/s', '/c', 'mvn clean install',arg], {
        cwd: cwd,
        windowsVerbatimArguments: true,
        encoding: 'utf8'
    });
    writeLogsToFile(constant.MVN_LOG_PATH, childProcess.stdout);
};

function runAsyncCommand(cwd, args) {
    console.log(chalk.red(`Processing  command with: ${args}`));
    const child = require('child_process');

    let childProcess = child.spawn('java', args, {
        encoding: 'utf8',
        cwd: cwd
    });

    console.log(`Working process on pid : ${childProcess.pid}`);
    shell.pids.push(childProcess.pid);
    childProcess.stdout.on('data', (data) => {
        writeLogsToFile(constant.APP_LOG_PATH, data);
});
};


function writeLogsToFile(file, data) {
    try {
        let writeStream = fs.createWriteStream(file, {flags: 'a'});
        writeStream.write(data);
    } catch (err) {
        console.log(err);
    }
}

module.exports = shell;