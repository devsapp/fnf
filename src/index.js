/** @format */
const {
    HLogger,
    ILogger,
    getCredential,
    help,
    commandParse,
    load,
    reportComponent,
} = require('@serverless-devs/core')
const Core = require('@alicloud/pop-core');
const fs = require('fs')
const {Component, Log} = require('@serverless-devs/s-core');

log = new Log()
const defaultOpt = {
    method: 'POST',
    headers: {
        'User-Agent': 'alicloud-serverless-devs'
    }
}


class MyComponent extends Component {
    async getClient(credentials, region) {
        return new Core({
            accessKeyId: credentials.AccessKeyID,
            accessKeySecret: credentials.AccessKeySecret,
            endpoint: 'https://' + region + '.fnf.aliyuncs.com',
            apiVersion: '2019-03-15'
        })
    }

    async deploy(inputs) {

        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} deploy [command]`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'region',
                        description: 'Stack region.',
                        alias: 'r',
                        type: String,
                    },
                    {
                        name: 'name',
                        description: 'Stack name.',
                        alias: 'n',
                        type: String,
                    },
                    {
                        name: 'definition',
                        description: 'Template path.',
                        alias: 'd',
                        type: String,
                    },
                    {
                        name: 'description',
                        description: 'Stack description.',
                        type: String,
                    },
                    {
                        name: 'type',
                        description: 'The type of the creation process. The value is FDL.',
                        type: String,
                    }
                ],
            },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'deploy',
            "uid": credential.AccountID,
        });

        await this.init()
        this.state = this.state || {}

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        log.info("Start deploy workflow ... ")

        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const definition = comParse.data.definition || comParse.data.d || inputs.props.definition
        const description = comParse.data.description || inputs.props.description || "Create By Serverless Devs"
        const type = comParse.data.type || inputs.props.type || "FDL"

        if (this.state && this.state.RegionId) {
            if (region != this.state.RegionId || name != this.state.Name) {
                // remove
                log.warn(`Try delete workflow ${this.state.Name}`)
                await new Promise((resolve, reject) => {
                    client.request('DeleteFlow', {
                        "RegionId": region,
                        "Name": this.state.Name
                    }, defaultOpt).then((result) => {
                        resolve(result);
                    }, (ex) => {
                        reject(ex)
                    })
                })
                log.warn(`Deleted workflow ${this.state.Name}`)
            }
        }

        let result = {
            RegionId: region,
            Name: name
        }

        const body = {
            "RegionId": region,
            "Name": name,
            "Description": description,
            "Type": type,
            "Definition": await fs.readFileSync(definition, 'utf-8')
        }
        if (inputs.props.roleArn) {
            body.RoleArn = inputs.props.roleArn
        }

        try {
            log.info(`Check workflow ${name} ... `)
            await new Promise((resolve, reject) => {
                client.request('DescribeFlow', {
                    "RegionId": region,
                    "Name": name
                }, defaultOpt).then((result) => {
                    resolve(result);
                }, (ex) => {
                    reject(ex)
                })
            })
            log.info(`Update workflow ${name} ... `)
            await new Promise((resolve, reject) => {
                client.request('UpdateFlow', body, defaultOpt).then((result) => {
                    resolve(result);
                }, (ex) => {
                    reject(ex)
                })
            })
        } catch (e) {
            log.info(`Create workflow ${name} ... `)
            if (String(e).includes('does not exist')) {
                await new Promise((resolve, reject) => {
                    client.request('CreateFlow', body, defaultOpt).then((result) => {
                        resolve(result);
                    }, (ex) => {
                        reject(ex)
                    })
                })
            } else {
                throw new Error(e)
            }
        }

        log.info(`Deployed workflow ${name} ... `)

        this.state = result
        await this.save()


        inputs.props = {
            report_content: {
                fnf: [{
                    region: result.RegionId,
                    name: result.Name
                }]
            }
        }
        return result
    }

    async list(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} list [command]`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'region',
                        description: 'Stack region.',
                        alias: 'r',
                        type: String,
                    }
                ],
            }]);
            return;
        }

        await this.init()
        this.state = this.state || {}

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)
        reportComponent("fnf", {
            "commands": 'list',
            "uid": credential.AccountID,
        });
        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)
        await this.init()

        log.info("List workflow ... ")

        comParse.data = comParse.data || []
        const flowList = []
        let flowLength = 100
        let nextToken = undefined
        while (flowLength >= 100) {
            const tempData = await new Promise((resolve, reject) => {
                const requestBody = nextToken ? {
                    "RegionId": region,
                    "Limit": 100,
                    "NextToken": nextToken,
                } : {
                    "RegionId": region,
                    "Limit": 100,
                }
                client.request('ListFlows', requestBody, defaultOpt).then((result) => {
                    resolve(result);
                }, (ex) => {
                    reject(ex)
                })
            })
            flowLength = tempData.Flows ? tempData.Flows.length : []
            for (let i = 0; i < flowLength; i++) {
                flowList.push(tempData.Flows[i])
            }
            nextToken = tempData.NextToken
        }

        if (flowList.length == 0) {
            log.info("No related list was obtained.")
        }

        return flowList

    }

    async remove(inputs) {

        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} remove [command]`
            }, {
                header: 'Options',
                optionList: [
                    {
                        name: 'region',
                        description: 'Stack region.',
                        alias: 'r',
                        type: String,
                    },
                    {
                        name: 'name',
                        description: 'Stack name.',
                        alias: 'n',
                        type: String,
                    }
                ],
            }]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'remove',
            "uid": credential.AccountID,
        });

        await this.init()
        this.state = this.state || {}

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        await this.init()

        log.info("Remove workflow ... ")

        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        await new Promise((resolve, reject) => {
            client.request('DeleteFlow', {
                "RegionId": region,
                "Name": name
            }, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        this.state = {}
        await this.save()

        inputs.props = {
            report_content: {
                fnf: []
            }
        }

        return {}

    }

    async execution_start(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution start [command]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'execution-name',
                            description: 'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
                            alias: 'e',
                            type: String,
                        },
                        {
                            name: 'input',
                            description: 'Input information for this execution.',
                            alias: 'i',
                            type: String,
                        },
                        {
                            name: 'input-path',
                            description: 'Input information path for this execution.',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'execution_start',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const executionName = comParse.data['execution-name'] || comParse.data.en || undefined
        let inputBody
        const input = comParse.data.input || comParse.data.i || undefined
        const inputPath = comParse.data['input-path'] || undefined
        if (!input && inputPath) {
            inputBody = await fs.readFileSync(inputPath, 'utf-8')
        } else if (input) {
            inputBody = input
        } else {
            inputBody = undefined
        }

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (executionName) {
            body.ExecutionName = executionName
        }

        if (inputBody) {
            body.Input = inputBody
        }

        const startExecutionResponse = await new Promise((resolve, reject) => {
            client.request('StartExecution', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        console.log(startExecutionResponse)

        return {
            RegionId: region,
            FlowName: name,
            StartedTime: startExecutionResponse.StartedTime,
            ExecutionName: startExecutionResponse.Name,
        }
    }

    async execution_stop(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution stop [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'execution-name',
                            description: 'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
                            alias: 'e',
                            type: String,
                        },
                        {
                            name: 'cause',
                            description: 'Stop the error reason.',
                            alias: 'c',
                            type: String,
                        },
                        {
                            name: 'error',
                            description: 'Stop the error code.',
                            alias: 'e',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'execution_stop',
            "uid": credential.AccountID,
        });


        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const executionName = comParse.data['execution-name'] || comParse.data.e || undefined
        const cause = comParse.data.cause || comParse.data.c || undefined
        const error = comParse.data.error || comParse.data.e || undefined

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (executionName) {
            body.ExecutionName = executionName
        }

        if (cause) {
            body.Cause = cause
        }

        if (error) {
            body.Error = error
        }

        const stopExecutionResponse = await new Promise((resolve, reject) => {
            client.request('StopExecution', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })
        return {
            RegionId: region,
            FlowName: name,
            StartedTime: stopExecutionResponse.StartedTime,
            StoppedTime: stopExecutionResponse.StoppedTime,
            ExecutionName: stopExecutionResponse.Name,
            Status: stopExecutionResponse.Status,
            Output: stopExecutionResponse.Output,
        }
    }

    async execution_get(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y', 'execution-name': 'en'},
        };
        const comParse = commandParse(inputs, apts);
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution get [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'execution-name',
                            description: 'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
                            alias: 'e',
                            type: String,
                        },
                        {
                            name: 'wait',
                            description: 'The longest waiting time of this describexecution request long polling. The legal values are 0 to 60, where waittimeseconds = 0 means that the request immediately returns to the current execution status; if waittimeseconds > 0, the request will be polled in the server for a long time to wait for the execution to finish, and the longest waiting time is seconds for waittimeseconds.',
                            alias: 'w',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'execution_get',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const executionName = comParse.data['execution-name'] || comParse.data.e || undefined
        const waitTimeSeconds = comParse.data.wait || comParse.data.w || undefined


        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (executionName) {
            body.ExecutionName = executionName
        }

        if (waitTimeSeconds) {
            body.WaitTimeSeconds = waitTimeSeconds
        }

        const descExecutionResponse = await new Promise((resolve, reject) => {
            client.request('DescribeExecution', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })
        return {
            RegionId: region,
            FlowName: name,
            StartedTime: descExecutionResponse.StartedTime,
            StoppedTime: descExecutionResponse.StoppedTime,
            Status: descExecutionResponse.Status,
            ExecutionName: descExecutionResponse.Name,
            Output: descExecutionResponse.Output,
        }
    }

    async execution_history(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution stop [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'execution-name',
                            description: 'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
                            alias: 'e',
                            type: String,
                        },
                        {
                            name: 'limit',
                            description: 'Number of queries.',
                            alias: 'l',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'execution_history',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const args = this.args(inputs.Args, [], []);
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const executionName = comParse.data['execution-name'] || comParse.data.e || undefined
        const limit = comParse.data.limit || comParse.data.l || 200

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (executionName) {
            body.ExecutionName = executionName
        }

        if (limit) {
            body.Limit = limit
        }

        const historyExecutionResponse = await new Promise((resolve, reject) => {
            client.request('GetExecutionHistory', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            Detail: historyExecutionResponse.Events,
        }
    }

    async execution_list(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution stop [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'execution-name',
                            description: 'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
                            alias: 'e',
                            type: String,
                        },
                        {
                            name: 'limit',
                            description: 'Number of queries.',
                            alias: 'l',
                            type: String,
                        },
                        {
                            name: 'filter',
                            description: 'The execution status of the filter you want to filter. The status supports the following fields: Running/Stopped/Succeeded/Failed/TimedOut.',
                            alias: 'f',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'execution_list',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const args = this.args(inputs.Args, [], []);
        const executionName = comParse.data['execution-name'] || comParse.data.e || undefined
        const limit = comParse.data.limit || comParse.data.l || 50
        const filter = comParse.data.filter || comParse.data.f || undefined
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (executionName) {
            body.ExecutionName = executionName
        }

        if (limit) {
            body.Limit = limit
        }

        if (filter) {
            body.Status = filter
        }

        const listExecutionResponse = await new Promise((resolve, reject) => {
            client.request('ListExecutions', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        const result = []
        for (let i = 0; i < listExecutionResponse.Executions.length; i++) {
            result.push({
                Execution: listExecutionResponse.Executions[i].Name,
                StartedTime: listExecutionResponse.Executions[i].StartedTime,
                StoppedTime: listExecutionResponse.Executions[i].StoppedTime,
                Status: listExecutionResponse.Executions[i].Status,
                Output: listExecutionResponse.Executions[i].Output,
            })
        }

        return {
            RegionId: region,
            FlowName: name,
            Detail: result,
        }
    }

    async execution(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}

        if (comParse.data._.length > 0) {
            if (comParse.data._[0] == "start") {
                return await this.execution_start(inputs)
            }
            if (comParse.data._[0] == "stop") {
                return await this.execution_stop(inputs)
            }
            if (comParse.data._[0] == "get") {
                return await this.execution_get(inputs)
            }
            if (comParse.data._[0] == "history") {
                return await this.execution_history(inputs)
            }
            if (comParse.data._[0] == "list") {
                return await this.execution_list(inputs)
            }
        }

        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} execution [command]`
            },
                {
                    header: 'Examples',
                    content: [
                        {
                            desc: 'list',
                            example: 'Get all historical execution under a process.'
                        },
                        {
                            desc: 'get',
                            example: 'Get the status of one execution and other information.'
                        },
                        {
                            desc: 'start',
                            example: 'Start a process execution.'
                        },
                        {
                            desc: 'stop',
                            example: 'Stop a process executione.'
                        },
                        {
                            desc: 'history',
                            example: 'Get the details of each step in the execution process.'
                        }
                    ],
                },]);
            return;
        }
    }

    async schedule_add(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} schedule add [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'schedule-mame',
                            description: 'The name of the scheduled schedule.',
                            alias: 's',
                            type: String,
                        },
                        {
                            name: 'cron',
                            description: 'Cron expression.',
                            alias: 'c',
                            type: String,
                        },
                        {
                            name: 'description',
                            description: 'Description of timing scheduling.',
                            alias: 'd',
                            type: String,
                        },
                        {
                            name: 'payload',
                            description: 'Trigger messages scheduled for timing must be in JSON format.',
                            alias: 'p',
                            type: String,
                        },
                        {
                            name: 'enable',
                            description: 'Whether scheduled scheduling is enabled.',
                            alias: 'e',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'schedule_add',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const cron = comParse.data.cron || comParse.data.c || undefined
        const scheduleName = comParse.data.scheduleName || comParse.data.s || undefined
        const description = comParse.data.description || comParse.data.d || undefined
        const payload = comParse.data.payload || comParse.data.p || undefined
        const enable = comParse.data.enable || comParse.data.e || undefined
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (cron) {
            body.CronExpression = cron
        }

        if (scheduleName) {
            body.ScheduleName = scheduleName
        }

        if (description) {
            body.Description = description
        }

        if (payload) {
            body.Payload = JSON.parse(payload)
        }

        if (enable) {
            body.Enable = enable
        }

        const createScheduleResponse = await new Promise((resolve, reject) => {
            client.request('CreateSchedule', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            ScheduleName: createScheduleResponse.ScheduleName,
            ScheduleId: createScheduleResponse.ScheduleId,
            CronExpression: createScheduleResponse.CronExpression,
            LastModifiedTime: createScheduleResponse.LastModifiedTime,
        }
    }

    async schedule_update(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} schedule update [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'schedule-mame',
                            description: 'The name of the scheduled schedule.',
                            alias: 's',
                            type: String,
                        },
                        {
                            name: 'cron',
                            description: 'Cron expression.',
                            alias: 'c',
                            type: String,
                        },
                        {
                            name: 'description',
                            description: 'Description of timing scheduling.',
                            alias: 'd',
                            type: String,
                        },
                        {
                            name: 'payload',
                            description: 'Trigger messages scheduled for timing must be in JSON format.',
                            alias: 'p',
                            type: String,
                        },
                        {
                            name: 'enable',
                            description: 'Whether scheduled scheduling is enabled.',
                            alias: 'e',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'schedule_update',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const cron = comParse.data.cron || comParse.data.c || undefined
        const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined
        const description = comParse.data.description || comParse.data.d || undefined
        const payload = comParse.data.payload || comParse.data.p || undefined
        const enable = comParse.data.enable || comParse.data.e || undefined
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        const body = {
            "RegionId": region,
            "FlowName": comParse.data.name || comParse.data.n || inputs.props.name
        }

        if (cron) {
            body.CronExpression = cron
        }

        if (scheduleName) {
            body.ScheduleName = scheduleName
        }

        if (description) {
            body.Description = description
        }

        if (payload) {
            body.Payload = JSON.parse(payload)
        }

        if (enable) {
            body.Enable = enable
        }

        const updateScheduleResponse = await new Promise((resolve, reject) => {
            client.request('UpdateSchedule', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            ScheduleName: updateScheduleResponse.ScheduleName,
            ScheduleId: updateScheduleResponse.ScheduleId,
            CronExpression: updateScheduleResponse.CronExpression,
            LastModifiedTime: updateScheduleResponse.LastModifiedTime,
        }
    }

    async schedule_list(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} schedule list [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'limit',
                            description: 'Limit the number of returns.',
                            alias: 'l',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'schedule_list',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const limit = comParse.data.limit || comParse.data.l || 50
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (limit) {
            body.Limit = limit
        }

        const listScheduleResponse = await new Promise((resolve, reject) => {
            client.request('ListSchedules', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            Scheduled: listScheduleResponse.Schedules
        }
    }

    async schedule_delete(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} schedule delete [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'schedule-mame',
                            description: 'The name of the scheduled schedule.',
                            alias: 's',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'schedule_datele',
            "uid": credential.AccountID,
        });

        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name

        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (scheduleName) {
            body.ScheduleName = scheduleName
        }

        await new Promise((resolve, reject) => {
            client.request('DeleteSchedule', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            ScheduleName: scheduleName
        }
    }

    async schedule_get(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help', 'assumeYes'],
            alias: {help: 'h', assumeYes: 'y'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `s ${inputs.Project.ProjectName} schedule get [args]`
            },
                {
                    header: 'Options',
                    optionList: [
                        {
                            name: 'region',
                            description: 'Stack region.',
                            alias: 'r',
                            type: String,
                        },
                        {
                            name: 'name',
                            description: 'Stack name.',
                            alias: 'n',
                            type: String,
                        },
                        {
                            name: 'schedule-mame',
                            description: 'The name of the scheduled schedule.',
                            alias: 's',
                            type: String,
                        }
                    ],
                },]);
            return;
        }

        // 获取密钥信息
        const credential = await getCredential(inputs.project.access)

        reportComponent("fnf", {
            "commands": 'schedule_get',
            "uid": credential.AccountID,
        });


        const region = comParse.data.region || comParse.data.r || this.state.RegionId || inputs.props.region || "cn-hangzhou"
        const client = await this.getClient(credential, region)

        // 将Args转成Object
        const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined
        const name = comParse.data.name || comParse.data.n || this.state.Name || inputs.props.name
        const body = {
            "RegionId": region,
            "FlowName": name
        }

        if (scheduleName) {
            body.ScheduleName = scheduleName
        }

        const descResult = await new Promise((resolve, reject) => {
            client.request('DescribeSchedule', body, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        return {
            RegionId: region,
            FlowName: name,
            CreatedTime: descResult.CreatedTime,
            CronExpression: descResult.CronExpression,
            LastModifiedTime: descResult.LastModifiedTime,
            Enable: descResult.Enable,
            Description: descResult.Description,
        }
    }

    async schedule(inputs) {
        await (await load('devsapp/2db')).addHistory(inputs)
        const apts = {
            boolean: ['help'],
            alias: {help: 'h'},
        };
        const comParse = commandParse({args: inputs.args}, apts);
        comParse.data = comParse.data || {}
        if (comParse.data._.length > 0) {
            if (comParse.data._[0] == "add") {
                return await this.schedule_add(inputs)
            }
            if (comParse.data._[0] == "update") {
                return await this.schedule_update(inputs)
            }
            if (comParse.data._[0] == "list") {
                return await this.schedule_list(inputs)
            }
            if (comParse.data._[0] == "delete") {
                return await this.schedule_delete(inputs)
            }
            if (comParse.data._[0] == "get") {
                return await this.schedule_get(inputs)
            }
        }
        if (comParse.data && comParse.data.help) {
            help([{
                header: 'Usage',
                content: `Usage: s ${inputs.Project.ProjectName} schedule [command]`
            },
                {
                    header: 'Examples',
                    content: [
                        {
                            desc: 'add',
                            example: 'Create a scheduled schedule.'
                        },
                        {
                            desc: 'update',
                            example: 'Update a scheduled schedule.'
                        },
                        {
                            desc: 'list',
                            example: 'Get scheduled schedule list.'
                        },
                        {
                            desc: 'delete',
                            example: 'Delete a scheduled schedule.'
                        },
                        {
                            desc: 'get',
                            example: 'Get a timing schedule.'
                        }
                    ],
                },]);
            return;
        }
    }
}

module.exports = MyComponent;
