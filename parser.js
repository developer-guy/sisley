const yaml = require('yamljs');
function MicroService(name, order, runargs, projectPath, mvnOptions) {
    this.name = name;
    this.order = order;
    this.runargs = runargs;
    this.projectPath = projectPath;
    this.mvnOptions = mvnOptions;
};

MicroService.prototype.toString = function () {
    return `Name : ${this.name}
            Order : ${this.order}
            Args : ${this.runargs}
            Path : ${this.projectPath}
            Maven build : ${this.mvnBuild}`;
}
let parser = {
    parse: function parse(data) {
        let microservices = [];
        const conf = yaml.load(data);
        console.log(`Conf: ${conf}`);

        for (let prop in conf) {
            if (!prop === 'starter') {
                throw {
                    reason: 'YAML Begin Keyword',
                    message: 'YAML file must begin "starter" keyword'
                };
            }
            let obj = conf[prop];
            for (let prop in obj) {
                let _obj = obj[prop];
                let index = exist(microservices, _obj);
                if (index === -1) {
                    microservices.push(new MicroService(_obj.name, _obj.order, _obj.args, _obj.projectPath, _obj.mvnOptions));
                } else {
                    throw {
                        reason: 'Same order',
                        message: `${microservices[index].name} and ${_obj.name} have same order.`
                    };
                }
            }
        }

        return Promise.resolve(microservices);
    }
}

function exist(arr, item) {
    let index = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].order === item.order) {
            index = i;
        }
    }
    return index;
}

module.exports = parser;