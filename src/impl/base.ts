import { parseArgv } from '@serverless-devs/utils';
import * as _ from 'lodash';
import * as $OpenApi from '@alicloud/openapi-client';
import fnf20190315 from '@alicloud/fnf20190315';
import GLogger from '../common/logger';

export default class FnfBase {
  defaultOpt: any;
  region: string;
  yes: boolean = false;
  argsObj: any;
  constructor(readonly inputs: any) {
    this.argsObj = parseArgv(inputs.args, {
      alias: { help: 'h', 'assume-yes': 'y' },
      boolean: ['help', 'y'],
      string: ['region', 'name'],
    });
    this.region = this.argsObj.region || _.get(inputs, 'props.region');
    if (!this.region) {
      throw new Error(`region is required`);
    }
    let validRegions = [
      'cn-beijing',
      'cn-hangzhou',
      'cn-shanghai',
      'cn-qingdao',
      'cn-shenzhen',
      'ap-southeast-1',
      'us-west-1',
    ];
    if (!validRegions.includes(this.region)) {
      throw new Error(`region is must be in ${JSON.stringify(validRegions)}`);
    }
    const log = GLogger.getLogger();
    log.debug(`inputs=${JSON.stringify(this.inputs)}`);
    log.debug(`argsObj=${JSON.stringify(this.argsObj)}`);
    this.yes = this.argsObj.y;
  }
  async getClient(command: string) {
    this.inputs.credentials = await this.inputs.getCredential();
    GLogger.getLogger().debug(JSON.stringify(this.inputs.credentials));
    const endpoint =
      this.argsObj.endpoint || this.inputs.props.endpoint || `${this.region}.fnf.aliyuncs.com`;
    const protocol = 'https';
    const config = new $OpenApi.Config({
      accessKeyId: this.inputs.credentials.AccessKeyID,
      accessKeySecret: this.inputs.credentials.AccessKeySecret,
      securityToken: this.inputs.credentials.SecurityToken,
      protocol,
      endpoint,
      readTimeout: 10000,
      connectTimeout: 5000,
      userAgent: `${
        this.inputs.userAgent ||
        `Component:fnf;Nodejs:${process.version};OS:${process.platform}-${process.arch}`
      }command:${command}`,
    });
    return new fnf20190315(config);
  }
}
