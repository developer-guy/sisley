const path = require('path'),
    fs = require('fs');

let fo = {
    find: function findFile(dir, format) {
        let file;
        const files = fs.readdirSync(dir, 'utf8');

        for (let i = 0; i < files.length; i++) {
            let extension = path.extname(files[i]);
            console.log('Searching files..');
            if (extension === format) {
                console.log(`File found: ${files[i]}`);
                file = files[i];
                break;
            }
        }

        return file;
    },
    search: function search(options) {
        let optionsFile = options.file;
        let file;
        try {
            if (!optionsFile) {
                file = fo.find(process.cwd(), '.yml');
            } else {
                console.log(`Starting with specific file : ${optionsFile}`);
                let extension = path.extname(optionsFile);
                if (extension === '.yml' || extension === '.yaml') {
                    file = optionsFile;
                }
            }

            if (!file) {
                return Promise.reject({
                    reason: 'File format',
                    message: 'No supported file format,file format must be .yml or .yaml'
                });
            }
        } catch (err) {
            return Promise.reject({
                reason: err,
                message: err.toString()
            });
        }

        return Promise.resolve(file);
    },
    logToFile: function writeLogsToFile(file, data) {
        try {
            fs.writeFileSync(file, data,{flag : 'a'});
        } catch (err) {
            console.log(err);
        }
    }
};


module.exports = fo;