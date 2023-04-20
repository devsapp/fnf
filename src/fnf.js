const Core = require('@alicloud/pop-core');
const { fse, lodash: _ } = require('@serverless-devs/core');
const path = require('path');
const log = require('./common/log');

const defaultOpt = {
  method: 'POST',
  headers: {
    'User-Agent': 'alicloud-serverless-devs'
  }
}

class Fnf {
  static getDefinition(definition) {
    if (_.isEmpty(definition)) {
      throw new Error('Definition is empty');
    }
    if (_.isString(definition)) {
      log.debug('definition is string, read file path: ');
      const u = path.join(process.cwd(), definition);
      log.debug(u);
      return fse.readFileSync(u, 'utf-8');
    }
    log.debug('definition not is string, skip read file');
    return JSON.stringify(definition); 
  }

  static getExecutionInput(comParse) {
    const input = _.get(comParse, 'input');
		if (!_.isEmpty(input)) {
      log.debug('execution input exists');
      return input;
		}
    const inputPath = _.get(comParse, 'input-path');
    if (_.isEmpty(inputPath)) {
      log.debug('execution input-path not exists');
      return;
    }
    log.debug('execution input-path exists, path:');
    const u = path.join(process.cwd(), inputPath);
    log.debug(u);
    return fse.readFileSync(u, 'utf-8');
  }

  static getRoleArn(arn, accountId) {
    if (_.isEmpty(arn)){
      return arn;
    }
    if (!_.startsWith(arn, 'acs:ram::')) {
      return `acs:ram::${accountId}:role/${arn}`
    }
    return arn;
  }

  constructor(credentials, region) {
    this.client = new Core({
      accessKeyId: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      securityToken: credentials.SecurityToken,
      endpoint: `https://${region}.fnf.aliyuncs.com`,
      apiVersion: '2019-03-15',
    });
  }

  async deploy(payload) {
    log.debug(`deploying payload:\n${JSON.stringify(payload, null, 2)}`);

    log.info(`Check workflow ${payload.Name} ... `);
    let hasFlow = false;
    try {
      const describeFlow = { RegionId: payload.RegionId, Name: payload.Name };
      await this.request('DescribeFlow', describeFlow);
      hasFlow = true;
    } catch(ex) {
      if (ex.code !== 'FlowNotExists') {
        throw ex;
      }
    }
    log.debug(`Has flow ${hasFlow}`)
    if (hasFlow) {
      await this.request('UpdateFlow', payload);
    } else {
      await this.request('CreateFlow', payload);
    }
    log.info(`Deployed workflow ${payload.Name} success`);
  }

  async remove(payload) {
    log.debug(`remove payload:\n${JSON.stringify(payload, null, 2)}`);
    log.info(`Remove workflow ${payload.Name}...`);
    try {
      await this.request('DeleteFlow', payload);
    } catch (ex) {
      if (ex.code !== 'FlowNotExists') {
        throw ex;
      }
    }
    log.info(`Remove workflow ${payload.Name} success.`);
  }

  async list(payload) {
    log.info(`Start list workflow...`);
    const flowList = [];
    do {
      log.debug(`List payload:\n${JSON.stringify(payload)}`);
      const { NextToken, RequestId, Flows = [] } = await this.request('ListFlows', payload);
      log.debug(`RequestId: ${RequestId} ; NextToken: ${NextToken}`);
      payload.NextToken = NextToken;
      flowList.push(...Flows);
    } while(payload.NextToken);
    log.info(`List workflow end`);
    if (flowList.length === 0) {
      log.info('No related list was obtained')
    }
    return flowList;
  }

  async listSchedules(payload) {
    log.info(`Start list schedules...`);
    const scheduleList = [];
    do {
      log.debug(`List payload:\n${JSON.stringify(payload)}`);
      const { NextToken, RequestId, Schedules = [] } = await this.request('ListSchedules', payload);
      log.debug(`RequestId: ${RequestId} ; NextToken: ${NextToken}`);
      payload.NextToken = NextToken;
      scheduleList.push(...Schedules);
    } while(payload.NextToken);
    log.info(`List schedules end`);
    if (scheduleList.length === 0) {
      log.info('No related list was obtained')
    }
    return scheduleList;
  }

  async deploySchedule(params) {
    const { name, region, 'schedule-mame': scheduleName } = params;

    let describeSchedule = {};
    try {
      describeSchedule = await this.describeSchedule({
        RegionId: region,
        FlowName: name,
        ScheduleName: scheduleName,
      });
    } catch (ex) {
      log.debug(ex);
      if (ex.code !== 'ScheduleNotExists') {
        throw ex;
      }
    }

    const cron = _.get(params, 'cron') || _.get(describeSchedule, 'cron', '@every 1440m');
    const description = _.get(params, 'description')  || _.get(describeSchedule, 'description', '');
    const payload = _.get(params, 'payload')  || _.get(describeSchedule, 'payload', '{"key":"value"}');
    const enable = _.get(params, 'enable')  || _.get(describeSchedule, 'enable', false);
    const p = {
      RegionId: region,
      FlowName: name,
      CronExpression: cron,
      ScheduleName: scheduleName,
      Description: description,
      Payload: payload,
      Enable: enable,
    };

    if (_.isEmpty(describeSchedule)) {
      return await this.createSchedule(p);
    }
    return await this.updateSchedule(p);
  }

  async describeSchedule(payload) {
    log.debug(`DescribeSchedule payload:\n${JSON.stringify(payload)}`);
    return await this.request('DescribeSchedule', payload);
  }

  async updateSchedule(payload) {
    log.debug(`UpdateSchedule payload:\n${JSON.stringify(payload)}`);
    return await this.request('UpdateSchedule', payload);
  }

  async createSchedule(payload) {
    log.debug(`CreateSchedule payload:\n${JSON.stringify(payload)}`);
    return await this.request('CreateSchedule', payload);
  }

  async deleteSchedule(payload) {
    log.debug(`DeleteSchedule payload:\n${JSON.stringify(payload)}`);
    return await this.request('DeleteSchedule', payload);
  }

  async startExecution(payload) {
    log.debug(`StartExecution payload:\n${JSON.stringify(payload)}`);
    return await this.request('StartExecution', payload);
  }

  async stopExecution(payload) {
    log.debug(`StopExecution payload:\n${JSON.stringify(payload)}`);
    return await this.request('StopExecution', payload);
  }

  async describeExecution(payload) {
    log.debug(`DescribeExecution payload:\n${JSON.stringify(payload)}`);
    return await this.request('DescribeExecution', payload);
  }

  async getExecutionHistory(payload) {
    log.info(`Start list execution history...`);
    const list = [];
    do {
      log.debug(`List payload:\n${JSON.stringify(payload)}`);
      const { NextToken, RequestId, Events = [] } = await this.request('GetExecutionHistory', payload);
      log.debug(`RequestId: ${RequestId} ; NextToken: ${NextToken}`);
      payload.NextToken = NextToken;
      list.push(...Events);
    } while(payload.NextToken);
    log.info(`List execution history end`);
    if (list.length === 0) {
      log.info('No related list was obtained')
    }
    return list;
  }

  async listExecutions(payload) {
    log.info(`Start list execution...`);
    const list = [];
    do {
      log.debug(`List payload:\n${JSON.stringify(payload)}`);
      const { NextToken, RequestId, Executions = [] } = await this.request('ListExecutions', payload);
      log.debug(`RequestId: ${RequestId} ; NextToken: ${NextToken}`);
      payload.NextToken = NextToken;
      list.push(...Executions);
    } while(payload.NextToken);
    log.info(`List execution end`);
    if (list.length === 0) {
      log.info('No related list was obtained')
    }
    return list;
  }

  async request(url, body, options = defaultOpt, ...args) {
    return await new Promise((resolve, reject) => {
      this.client.request(url, body, options, ...args).then(resolve).catch(reject);
    })
  }
}

module.exports = Fnf;
