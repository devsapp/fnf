import FnfBase from './base';
import log from './logger';
import * as fs from 'fs';

export class FnfExecution extends FnfBase {
  async start() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    const executionName = comParse.data['execution-name'] || comParse.data.en || undefined;
    let inputBody;
    const input = comParse.data.input || comParse.data.i || undefined;
    const inputPath = comParse.data['input-path'] || undefined;
    const syncInvoke = comParse.data['sync'] || false;
    if (!input && inputPath) {
      inputBody = await fs.readFileSync(inputPath, 'utf-8');
    } else if (input) {
      inputBody = input;
    } else {
      inputBody = undefined;
    }

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (executionName) {
      body.ExecutionName = executionName;
    }

    if (inputBody) {
      body.Input = inputBody;
    }

    let methodName = 'StartExecution';
    if (syncInvoke) {
      methodName = 'StartSyncExecution';
    }

    const startExecutionResponse = await new Promise((resolve, reject) => {
      client.request(methodName, body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    log.debug(JSON.stringify(startExecutionResponse));
    const resp = startExecutionResponse as any;

    return {
      RegionId: region,
      FlowName: name,
      ExecutionName: resp.Name,
      StartedTime: resp.StartedTime,
      StoppedTime: resp.StoppedTime,
      Response: resp,
    };
  }

  async stop() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    const executionName = comParse.data['execution-name'] || comParse.data.e || undefined;
    const cause = comParse.data.cause || comParse.data.c || undefined;
    const error = comParse.data.error || comParse.data.e || undefined;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (executionName) {
      body.ExecutionName = executionName;
    }

    if (cause) {
      body.Cause = cause;
    }

    if (error) {
      body.Error = error;
    }

    const stopExecutionResponse: any = await new Promise((resolve, reject) => {
      client.request('StopExecution', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });
    return {
      RegionId: region,
      FlowName: name,
      StartedTime: stopExecutionResponse.StartedTime,
      StoppedTime: stopExecutionResponse.StoppedTime,
      ExecutionName: stopExecutionResponse.Name,
      Status: stopExecutionResponse.Status,
      Output: stopExecutionResponse.Output,
    };
  }

  async get() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    const executionName = comParse.data['execution-name'] || comParse.data.e || undefined;
    const waitTimeSeconds = comParse.data.wait || comParse.data.w || undefined;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (executionName) {
      body.ExecutionName = executionName;
    }

    if (waitTimeSeconds) {
      body.WaitTimeSeconds = waitTimeSeconds;
    }

    let descExecutionResponse: any = await new Promise((resolve, reject) => {
      client.request('DescribeExecution', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });
    return {
      RegionId: region,
      FlowName: name,
      StartedTime: descExecutionResponse.StartedTime,
      StoppedTime: descExecutionResponse.StoppedTime,
      Status: descExecutionResponse.Status,
      ExecutionName: descExecutionResponse.Name,
      Output: descExecutionResponse.Output,
    };
  }

  async history() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    const executionName = comParse.data['execution-name'] || comParse.data.e || undefined;
    const limit = comParse.data.limit || comParse.data.l || 200;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (executionName) {
      body.ExecutionName = executionName;
    }

    if (limit) {
      body.Limit = limit;
    }

    const historyExecutionResponse: any = await new Promise((resolve, reject) => {
      client.request('GetExecutionHistory', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      Detail: historyExecutionResponse.Events,
    };
  }

  async list() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const executionName = comParse.data['execution-name'] || comParse.data.e || undefined;
    const limit = comParse.data.limit || comParse.data.l || 50;
    const filter = comParse.data.filter || comParse.data.f || undefined;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (executionName) {
      body.ExecutionName = executionName;
    }

    if (limit) {
      body.Limit = limit;
    }

    if (filter) {
      body.Status = filter;
    }

    const listExecutionResponse: { Executions: any } | any = await new Promise(
      (resolve, reject) => {
        client.request('ListExecutions', body, defaultOpt).then(
          (res: any) => {
            resolve(res);
          },
          (ex) => {
            reject(ex);
          },
        );
      },
    );

    let result: any[] = [];
    let executions = listExecutionResponse.Executions as [];
    for (let i = 0; i < executions.length; i++) {
      let execution = executions[i] as any;
      let e = {
        Execution: execution?.Name,
        StartedTime: execution?.StartedTime,
        StoppedTime: execution?.StoppedTime,
        Status: execution?.Status,
        Output: execution?.Output,
      };
      result.push(e);
    }

    return {
      RegionId: region,
      FlowName: name,
      Detail: result,
    };
  }
}
