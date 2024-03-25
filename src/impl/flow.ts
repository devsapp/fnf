import FnfBase from './base';
import * as fs from 'fs';
import * as $fnf20190315 from '@alicloud/fnf20190315';
import GLogger from '../common/logger';
import { promptForConfirmOrDetails } from './util';

export class FnfFlow extends FnfBase {
  async deploy() {
    const client = await this.getClient('deploy');
    const inputs = this.inputs;
    const name = this.argsObj.name || inputs.props.name;
    const definitionFilePath = this.argsObj.definition || inputs.props.definition;
    const definition = fs.readFileSync(definitionFilePath, 'utf-8');
    const description =
      this.argsObj.description || inputs.props.description || 'Created By Serverless Devs';
    const type = this.argsObj.type || inputs.props.type || 'FDL';
    const executionMode = this.argsObj.executionMode || inputs.props.executionMode || 'Standard';
    const roleArn = this.argsObj.roleArn || inputs.props.roleArn;

    const log = GLogger.getLogger();
    log.debug(`Start deploy workflow ${name} ...`);
    let result: any = {
      region: this.region,
    };
    try {
      log.debug(`Check workflow ${name} ... `);
      let describeFlowRequest = new $fnf20190315.DescribeFlowRequest({
        name,
      });
      let flowInfo = await client.describeFlow(describeFlowRequest);
      log.debug(`Get flow definition: ${JSON.stringify(flowInfo)}`);
      log.debug(`Update workflow ${name} ... `);
      let updateFlowRequest = new $fnf20190315.UpdateFlowRequest({
        name,
        definition,
        description,
        type,
      });
      if (roleArn) {
        updateFlowRequest.roleArn = roleArn;
      }
      let response = await client.updateFlow(updateFlowRequest);
      result = Object.assign({}, result, response.body);
    } catch (e) {
      log.debug(String(e));
      if (String(e).includes(`Flow '${name}' does not exist`)) {
        log.debug(`Create workflow ${name} ... `);
        let createFlowRequest = new $fnf20190315.CreateFlowRequest({
          name,
          definition,
          description,
          type,
          executionMode,
        });
        if (roleArn) {
          createFlowRequest.roleArn = roleArn;
        }
        log.debug(`${JSON.stringify(createFlowRequest)}`);
        let response = await client.createFlow(createFlowRequest);
        result = Object.assign({}, result, response.body);
      } else {
        throw new Error(e);
      }
    }
    log.debug(`Deployed workflow ${name}\n ${JSON.stringify(result)} ...`);
    return result;
  }

  async info() {
    const client = await this.getClient('info');
    const log = GLogger.getLogger();

    const name = this.argsObj.name || this.inputs.props.name;
    let result: any = {
      region: this.region,
    };

    log.debug(`Info workflow ${name} ... `);
    let describeFlowRequest = new $fnf20190315.DescribeFlowRequest({
      name,
    });
    let response = await client.describeFlow(describeFlowRequest);
    result = Object.assign({}, result, response.body);
    return result;
  }

  async remove() {
    const log = GLogger.getLogger();
    const name = this.argsObj.name || this.inputs.props.name;
    if (this.yes) {
      await this.forceDeleteFlow(name);
      return;
    }
    const msg = `Do you want to delete this cloud flow: ${this.region}/${name}`;
    if (await promptForConfirmOrDetails(msg)) {
      await this.forceDeleteFlow(name);
      log.debug(`delete cloud flow: ${this.region}/${name} success`);
    }
  }

  async forceDeleteFlow(name: string) {
    const log = GLogger.getLogger();
    const client = await this.getClient('remove');
    let listSchedulesRequest = new $fnf20190315.ListSchedulesRequest({
      flowName: name,
      limit: 1000,
    });
    const resp = await client.listSchedules(listSchedulesRequest);
    const schedules = resp.body.toMap()['Schedules'];
    if (schedules && schedules.length > 0) {
      for (let i = 0; i < schedules.length; i++) {
        const scheduleName = schedules[i]['ScheduleName'];
        let deleteScheduleRequest = new $fnf20190315.DeleteScheduleRequest({
          flowName: name,
          scheduleName,
        });
        log.write(`Remove cloud flow schedule: ${this.region}/${name}/${scheduleName}`);
        await client.deleteSchedule(deleteScheduleRequest);
      }
    }
    log.write(`Remove cloud flow: ${this.region}/${name}`);
    let deleteFlowRequest = new $fnf20190315.DeleteFlowRequest({
      name,
    });
    await client.deleteFlow(deleteFlowRequest);
    log.debug(`delete cloud flow: ${this.region}/${name} success`);
  }

  async list() {
    const client = await this.getClient('list');
    let result: any = {
      region: this.region,
    };
    let listFlowRequest = new $fnf20190315.ListFlowsRequest({
      limit: 1000,
    });
    let response = await client.listFlows(listFlowRequest);
    const flows = response.body.toMap()['Flows'] || [];
    result = Object.assign({}, result, { flows });
    return result;
  }
}
