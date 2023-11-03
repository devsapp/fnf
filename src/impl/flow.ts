import FnfBase from './base';
import log from './logger';
import * as fs from 'fs';

export class FnfFlow extends FnfBase {
  async deploy() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    const definition = comParse.data.definition || comParse.data.d || inputs.props.definition;
    const description =
      comParse.data.description || inputs.props.description || 'Create By Serverless Devs';
    const type = comParse.data.type || inputs.props.type || 'FDL';
    const executionMode = comParse.data.executionMode || inputs.props.executionMode || 'Standard';

    log.debug(`Start deploy workflow ${name} ...`);

    let body: any = {
      RegionId: region,
      Name: name,
      Description: description,
      Type: type,
      ExecutionMode: executionMode,
      Definition: await fs.readFileSync(definition, 'utf-8'),
    };
    if (inputs.props.roleArn) {
      body.RoleArn = inputs.props.roleArn;
    }
    let result: any = {
      RegionId: region,
      Name: name,
    };
    try {
      log.info(`Check workflow ${name} ... `);
      let flowDefinition = await new Promise((resolve, reject) => {
        client
          .request(
            'DescribeFlow',
            {
              RegionId: region,
              Name: name,
            },
            defaultOpt,
          )
          .then(
            (result) => {
              resolve(result);
            },
            (ex) => {
              reject(ex);
            },
          );
      });
      log.debug(`Flow definition: ${JSON.stringify(flowDefinition)}`);
      log.debug(`Update workflow ${name} ... `);
      let response = await new Promise((resolve, reject) => {
        client.request('UpdateFlow', body, defaultOpt).then(
          (result) => {
            resolve(result);
          },
          (ex) => {
            reject(ex);
          },
        );
      });
      result.Response = response;
    } catch (e) {
      log.debug(`Create workflow ${name} ... `);
      if (String(e).includes('does not exist')) {
        let response = await new Promise((resolve, reject) => {
          client.request('CreateFlow', body, defaultOpt).then(
            (result) => {
              resolve(result);
            },
            (ex) => {
              reject(ex);
            },
          );
        });
        result.Response = response;
      } else {
        throw new Error(e);
      }
    }

    log.debug(`Deployed workflow ${name}\n ${JSON.stringify(result)} ...`);
    return result;
  }

  async list() {
    log.debug('List workflow ... ');
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;
    const flowList = [];
    let flowLength = 100;
    let nextToken = undefined;
    while (flowLength >= 100) {
      let tempData = (await new Promise((resolve, reject) => {
        const requestBody = nextToken
          ? {
              RegionId: region,
              Limit: 100,
              NextToken: nextToken,
            }
          : {
              RegionId: region,
              Limit: 100,
            };
        client.request('ListFlows', requestBody, defaultOpt).then(
          (result: any) => {
            resolve(result);
          },
          (ex) => {
            reject(ex);
          },
        );
      })) as any;
      const flowLength = tempData.Flows ? tempData.Flows.length : 0;
      let flows = tempData.Flows as [];
      for (let i = 0; i < flowLength; i++) {
        flowList.push(flows[i]);
      }
      nextToken = tempData.NextToken;
      if (!nextToken) {
        break;
      }
    }

    if (flowList.length == 0) {
      log.info('No related list was obtained.');
    }

    return flowList;
  }

  async remove() {
    log.info('Remove workflow ... ');
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    await new Promise((resolve, reject) => {
      client
        .request(
          'DeleteFlow',
          {
            RegionId: region,
            Name: name,
          },
          defaultOpt,
        )
        .then(
          (result) => {
            resolve(result);
          },
          (ex) => {
            reject(ex);
          },
        );
    });
  }

  async info() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let result: any = {
      RegionId: region,
    };

    let response: Object = await new Promise((resolve, reject) => {
      client
        .request(
          'DescribeFlow',
          {
            RegionId: region,
            Name: name,
          },
          defaultOpt,
        )
        .then(
          (result) => {
            resolve(result);
          },
          (ex) => {
            reject(ex);
          },
        );
    });
    result = { ...result, ...response };
    return result;
  }
}
