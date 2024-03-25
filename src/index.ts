import { FnfFlow } from './impl/flow';
import { COMMAND_HELP } from './impl/help';
import GLogger from './common/logger';

export default class ComponentFnf {
  protected commands: any;
  constructor({ logger }: any) {
    GLogger.setLogger(logger || console);
    this.commands = COMMAND_HELP;
  }

  async deploy(inputs: any) {
    const flowObj = new FnfFlow(inputs);
    return await flowObj.deploy();
  }

  async remove(inputs: any) {
    const flowObj = new FnfFlow(inputs);
    return await flowObj.remove();
  }

  async info(inputs: any) {
    const flowObj = new FnfFlow(inputs);
    return await flowObj.info();
  }

  // async plan(inputs: any) {
  //   GLogger.getLogger().debug('empty plan');
  // }

  async list(inputs) {
    const flowObj = new FnfFlow(inputs);
    return await flowObj.list();
  }
}
