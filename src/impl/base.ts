import { getCredential } from '@serverless-devs/core';
import PopCore from '@alicloud/pop-core';

export default class FnfBase {
  defaultOpt: any;
  region: string;
  constructor(
    readonly inputs: any,
    readonly comParse: any,
  ) {
    this.defaultOpt = {
      method: 'POST',
      headers: {
        'User-Agent': 'serverless-devs',
      },
    };
  }
  async getClient() {
    const inputs = this.inputs;
    const comParse = this.comParse;
    const credentials = await getCredential(inputs.project.access);
    const region = comParse.data.region || comParse.data.r || inputs.props.region || 'cn-hangzhou';
    this.region = region;
    const endpoint =
      comParse.data.endpoint || this.inputs.props.endpoint || `https://${region}.fnf.aliyuncs.com`;
    return new PopCore({
      accessKeyId: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      securityToken: credentials.SecurityToken,
      endpoint: endpoint,
      apiVersion: '2019-03-15',
    });
  }
}
