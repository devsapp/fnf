import { help, commandParse } from '@serverless-devs/core';
import FNF_HELP from './help';
import { FnfFlow } from './impl/flow';
import { FnfExecution } from './impl/execution';
import { FnfSchedule } from './impl/schedule';

class FnfComponent {
  private _init_help(inputs: any, summary: string, detail: any) {
    const apts = {
      boolean: ['help'],
      alias: { help: 'h' },
    };
    const comParse = commandParse({ args: inputs.args }, apts) as any;
    comParse.data = comParse.data || {};
    if (comParse.data && comParse.data.help) {
      help([
        {
          header: 'Usage',
          content: summary,
        },
        detail,
      ]);
      return;
    }
    return comParse;
  }
  async deploy(inputs: any) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} deploy [command]`,
      FNF_HELP.deploy,
    );
    if (!comParse) {
      return;
    }
    const flowObj = new FnfFlow(inputs, comParse);
    return await flowObj.deploy();
  }

  async list(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} list [command]`,
      FNF_HELP.list,
    );
    if (!comParse) {
      return;
    }
    const flowObj = new FnfFlow(inputs, comParse);
    return await flowObj.list();
  }

  async remove(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} remove [command]`,
      FNF_HELP.remove,
    );
    if (!comParse) {
      return;
    }
    const flowObj = new FnfFlow(inputs, comParse);
    return await flowObj.remove();
  }

  async info(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} info [command]`,
      FNF_HELP.info,
    );
    if (!comParse) {
      return;
    }
    const flowObj = new FnfFlow(inputs, comParse);
    return await flowObj.info();
  }

  async execution(inputs) {
    const apts = {
      boolean: ['help'],
      alias: { help: 'h' },
    };
    const comParse = commandParse({ args: inputs.args }, apts) as any;
    comParse.data = comParse.data || {};
    if (comParse.data._.length > 0) {
      if (comParse.data._[0] == 'start') {
        return await this.execution_start(inputs);
      }
      if (comParse.data._[0] == 'stop') {
        return await this.execution_stop(inputs);
      }
      if (comParse.data._[0] == 'get') {
        return await this.execution_get(inputs);
      }
      if (comParse.data._[0] == 'history') {
        return await this.execution_history(inputs);
      }
      if (comParse.data._[0] == 'list') {
        return await this.execution_list(inputs);
      }
    }
    if (comParse.data && comParse.data.help) {
      help([
        {
          header: 'Usage',
          content: `s ${inputs.project.projectName} execution [command]`,
        },
        FNF_HELP.execution,
      ]);
      return;
    }
  }

  async schedule(inputs) {
    const apts = {
      boolean: ['help'],
      alias: { help: 'h' },
    };
    const comParse = commandParse({ args: inputs.args }, apts) as any;
    comParse.data = comParse.data || {};
    if (comParse.data._.length > 0) {
      if (comParse.data._[0] == 'add') {
        return await this.schedule_add(inputs);
      }
      if (comParse.data._[0] == 'update') {
        return await this.schedule_update(inputs);
      }
      if (comParse.data._[0] == 'list') {
        return await this.schedule_list(inputs);
      }
      if (comParse.data._[0] == 'delete') {
        return await this.schedule_delete(inputs);
      }
      if (comParse.data._[0] == 'get') {
        return await this.schedule_get(inputs);
      }
    }
    if (comParse.data && comParse.data.help) {
      help([
        {
          header: 'Usage',
          content: `Usage: s ${inputs.project.projectName} schedule [command]`,
        },
        FNF_HELP.schedule,
      ]);
      return;
    }
  }

  async execution_start(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} execution start [command]`,
      FNF_HELP.execution_start,
    );
    if (!comParse) {
      return;
    }
    const executionObj = new FnfExecution(inputs, comParse);
    return await executionObj.start();
  }

  async execution_stop(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} execution stop [args]`,
      FNF_HELP.execution_stop,
    );
    if (!comParse) {
      return;
    }
    const executionObj = new FnfExecution(inputs, comParse);
    return await executionObj.stop();
  }

  async execution_get(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} execution get [args]`,
      FNF_HELP.execution_get,
    );
    if (!comParse) {
      return;
    }
    const executionObj = new FnfExecution(inputs, comParse);
    return await executionObj.get();
  }

  async execution_history(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} execution history [args]`,
      FNF_HELP.execution_history,
    );
    if (!comParse) {
      return;
    }

    const executionObj = new FnfExecution(inputs, comParse);
    return await executionObj.history();
  }

  async execution_list(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} execution list [args]`,
      FNF_HELP.execution_list,
    );
    if (!comParse) {
      return;
    }
    const executionObj = new FnfExecution(inputs, comParse);
    return await executionObj.list();
  }

  async schedule_add(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} schedule add [args]`,
      FNF_HELP.schedule_add,
    );
    if (!comParse) {
      return;
    }
    const scheduleObj = new FnfSchedule(inputs, comParse);
    return await scheduleObj.add();
  }

  async schedule_update(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} schedule update [args]`,
      FNF_HELP.schedule_update,
    );
    if (!comParse) {
      return;
    }

    const scheduleObj = new FnfSchedule(inputs, comParse);
    return await scheduleObj.update();
  }

  async schedule_list(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} schedule list [args]`,
      FNF_HELP.schedule_list,
    );
    if (!comParse) {
      return;
    }
    const scheduleObj = new FnfSchedule(inputs, comParse);
    return await scheduleObj.list();
  }

  async schedule_delete(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} schedule delete [args]`,
      FNF_HELP.schedule_delete,
    );
    if (!comParse) {
      return;
    }

    const scheduleObj = new FnfSchedule(inputs, comParse);
    return await scheduleObj.delete();
  }

  async schedule_get(inputs) {
    const comParse = this._init_help(
      inputs,
      `s ${inputs.project.projectName} schedule get [args]`,
      FNF_HELP.schedule_get,
    );
    if (!comParse) {
      return;
    }

    const scheduleObj = new FnfSchedule(inputs, comParse);
    return await scheduleObj.get();
  }
}

module.exports = FnfComponent;
