import { FnfFlow } from './impl/flow';
import { COMMAND_HELP } from './impl/help';
import GLogger from './common/logger';

export default class ComponentFnf {
  protected commands: any;
  private logger: any;
  constructor({ logger }: any) {
    this.logger = logger;
    this.commands = COMMAND_HELP;
  }

  async deploy(inputs: any) {
    GLogger.setLogger(this.logger);
    const flowObj = new FnfFlow(inputs);
    return await flowObj.deploy();
  }

  async remove(inputs: any) {
    GLogger.setLogger(this.logger);
    const flowObj = new FnfFlow(inputs);
    return await flowObj.remove();
  }

  async info(inputs: any) {
    GLogger.setLogger(this.logger);
    const flowObj = new FnfFlow(inputs);
    return await flowObj.info();
  }

  // async plan(inputs: any) {
  //   GLogger.getLogger().debug('empty plan');
  // }

  async list(inputs) {
    GLogger.setLogger(this.logger);
    const flowObj = new FnfFlow(inputs);
    return await flowObj.list();
  }
}
