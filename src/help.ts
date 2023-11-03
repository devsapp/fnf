const FNF_HELP = {
  deploy: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
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
        description: 'Flow description.',
        type: String,
      },
      {
        name: 'type',
        description: 'The type of the creation process. The value is FDL.',
        type: String,
      },
      {
        name: 'executionMode',
        description:
          'The type of execution. The value is Standard or Express, None value is Standard by default.',
        type: String,
      },
      {
        name: 'endpoint',
        description: 'fnf endpoint.',
        type: String,
      },
    ],
  },
  list: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
    ],
  },
  remove: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
    ],
  },
  info: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
    ],
  },
  execution_start: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'execution-name',
        description:
          'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
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
      },
      {
        name: 'sync',
        description: 'Sync start execution',
        type: Boolean,
      },
    ],
  },
  execution_stop: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'execution-name',
        description:
          'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
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
      },
    ],
  },
  execution_get: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'execution-name',
        description:
          'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'wait',
        description:
          'The longest waiting time of this describexecution request long polling. The legal values are 0 to 60, where waittimeseconds = 0 means that the request immediately returns to the current execution status; if waittimeseconds > 0, the request will be polled in the server for a long time to wait for the execution to finish, and the longest waiting time is seconds for waittimeseconds.',
        alias: 'w',
        type: String,
      },
    ],
  },
  execution_history: {
    header: 'Options',
    optionList: [
      {
        name: 'execution-name',
        description:
          'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'limit',
        description: 'Number of queries.',
        alias: 'l',
        type: String,
      },
    ],
  },
  execution_list: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'execution-name',
        description:
          'User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
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
        description:
          'The execution status of the filter you want to filter. The status supports the following fields: Running/Stopped/Succeeded/Failed/TimedOut.',
        alias: 'f',
        type: String,
      },
    ],
  },
  execution: {
    header: 'Examples',
    content: [
      {
        desc: 'list',
        example: 'Get all historical execution under a process.',
      },
      {
        desc: 'get',
        example: 'Get the status of one execution and other information.',
      },
      {
        desc: 'start',
        example: 'Start a process execution.',
      },
      {
        desc: 'stop',
        example: 'Stop a process executione.',
      },
      {
        desc: 'history',
        example: 'Get the details of each step in the execution process.',
      },
    ],
  },
  schedule_add: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
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
      },
    ],
  },
  schedule_update: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
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
      },
    ],
  },
  schedule_list: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'limit',
        description: 'Limit the number of returns.',
        alias: 'l',
        type: String,
      },
    ],
  },
  schedule_delete: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'schedule-mame',
        description: 'The name of the scheduled schedule.',
        alias: 's',
        type: String,
      },
    ],
  },
  schedule_get: {
    header: 'Options',
    optionList: [
      {
        name: 'region',
        description: 'Flow region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'name',
        description: 'Flow name.',
        alias: 'n',
        type: String,
      },
      {
        name: 'schedule-mame',
        description: 'The name of the scheduled schedule.',
        alias: 's',
        type: String,
      },
    ],
  },
  schedule: {
    header: 'Examples',
    content: [
      {
        desc: 'add',
        example: 'Create a scheduled schedule.',
      },
      {
        desc: 'update',
        example: 'Update a scheduled schedule.',
      },
      {
        desc: 'list',
        example: 'Get scheduled schedule list.',
      },
      {
        desc: 'delete',
        example: 'Delete a scheduled schedule.',
      },
      {
        desc: 'get',
        example: 'Get a timing schedule.',
      },
    ],
  },
};
export default FNF_HELP;
