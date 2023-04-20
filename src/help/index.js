const globalParams = {
  header: 'Global Options',
  optionList: [
    {
      name: 'debug',
      description: '[Optional] Output debug informations  ',
      type: String,
    },
    {
      name: 'help',
      description: '[Optional] Help for command',
      alias: 'h',
      type: Boolean,
    },
    {
      name: 'template',
      description: '[Optional] Specify the template file',
      alias: 't',
      type: String,
    },
    {
      name: 'access',
      description: '[Optional] Specify key alias',
      alias: 'a',
      type: String,
    },
  ],
};
const region = {
  name: 'region',
  description: '[Optional] Stack region. Defaults to cn-hangzhou',
  alias: 'r',
  type: String,
};
const name = {
  name: 'name',
  description: '[Optional] Stack name.',
  alias: 'n',
  type: String,
};

const deploy = [
  {
    header: 'Deploy',
    content: 'Deploy fnf resources',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'definition',
        description: '[Optional] Template path.',
        type: String,
      },
      {
        name: 'description',
        description: '[Optional] Stack description.',
        type: String,
      },
      {
        name: 'type',
        description: '[Optional] The type of the creation process. Defaults to is FDL.',
        type: String,
      }
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s deploy',
    ],
  },
];

const remove = [
  {
    header: 'Remove',
    content: 'Remove fnf resources',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s remove',
    ],
  },
];

const list = [
  {
    header: 'List',
    content: 'Show fnf resources',
  },
  {
    header: 'Options',
    optionList: [
      region,
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s list',
    ],
  },
];

const schedule = [
  {
    header: 'Schedule',
    content: 'Handler schedule',
  },
  {
    header: 'Usage',
    content: ['$ s schedule <sub-command> <options>'],
  },
  { ...globalParams },
  {
    header: 'SubCommand List',
    content: [
      {
        desc: 'deploy',
        example: 'Add or update schedule; help command [s schedule deploy -h]',
      },
      {
        desc: 'remove',
        example: 'Remove schedule; help command [s schedule remove -h]',
      },
      {
        desc: 'get',
        example: 'Get schedule config; help command [s schedule get -h]',
      },
      {
        desc: 'list',
        example: 'List schedule; help command [s schedule list -h]',
      },
    ],
  },
];

const scheduleGet = [
  {
    header: 'Schedule get',
    content: 'Get schedule config',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'schedule-mame',
        description: '[Required] The name of the scheduled schedule.',
        alias: 's',
        type: String,
      }
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s schedule get -s test',
    ],
  },
];

const scheduleList = [
  {
    header: 'Schedule list',
    content: 'List schedule config',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s schedule list',
    ],
  },
];

const scheduleDeploy = [
  {
    header: 'Schedule deploy',
    content: 'Deploy schedule',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'schedule-mame',
        description: '[Required] The name of the scheduled schedule.',
        alias: 's',
        type: String,
      },
      {
        name: 'cron',
        description: '[Required] Cron expression. Default is "@every 1440m"',
        alias: 'c',
        type: String,
      },
      {
        name: 'payload',
        description: '[Required] Trigger messages scheduled for timing must be in JSON format. Default value \'\\{"key":"value"\\}\'',
        alias: 'p',
        type: String,
      },
      {
        name: 'enable',
        description: '[Required] Whether scheduled scheduling is enabled. Default value \'false\'',
        alias: 'e',
        type: Boolean,
      },
      {
        name: 'description',
        description: '[Optional] Description of timing scheduling.',
        type: String,
      },
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s schedule deploy -s test -c "@every 1440m" -e',
    ],
  },
];

const scheduleRemove = [
  {
    header: 'Schedule remove',
    content: 'Remove schedule',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'schedule-mame',
        description: '[Required] The name of the scheduled schedule.',
        alias: 's',
        type: String,
      }
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s schedule remove -s test',
    ],
  },
];

const execution = [
  {
    header: 'Execution',
    content: 'Process-related operations'
  },
  {
    header: 'Examples',
    content: [
      {
        desc: 'list',
        example: 'Get all historical execution under a process.'
      },
      {
        desc: 'get',
        example: 'Get the status of one execution and other information.'
      },
      {
        desc: 'start',
        example: 'Start a process execution.'
      },
      {
        desc: 'stop',
        example: 'Stop a process executione.'
      },
      {
        desc: 'history',
        example: 'Get the details of each step in the execution process.'
      }
    ],
  }
];

const executionStart = [
  {
    header: 'Execution start',
    content: 'Call start execution to start a process execution',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'execution-name',
        description: '[Required] User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'input',
        description: '[Required] Input information for this execution.',
        alias: 'i',
        type: String,
      },
      {
        name: 'input-path',
        description: '[Optional] Input information path for this execution.',
        type: String,
      },
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s execution start -e a1 --input \'\\{\\}\'',
    ],
  },
];

const executionStop = [
  {
    header: 'Execution stop',
    content: 'Call stop execution to stop an executing process',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'execution-name',
        description: '[Required] User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'cause',
        description: '[Optional]Stop the error reason.',
        alias: 'c',
        type: String,
      },
      {
        name: 'error',
        description: '[Optional]Stop the error code.',
        type: String,
      }
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s execution stop -e name',
    ],
  },
];

const executionGet = [
  {
    header: 'Execution get',
    content: 'Call describe execution to obtain information such as the status of an execution',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'execution-name',
        description: '[Required] User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'wait',
        description: '[Optional] The longest waiting time of this describexecution request long polling. The legal values are 0 to 60, where waittimeseconds = 0 means that the request immediately returns to the current execution status; if waittimeseconds > 0, the request will be polled in the server for a long time to wait for the execution to finish, and the longest waiting time is seconds for waittimeseconds.',
        alias: 'w',
        type: Number,
      },
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s execution get -e name',
    ],
  },
];

const executionHistory = [
  {
    header: 'Execution history',
    content: 'Call get execution history to get details of each step in the execution process',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'execution-name',
        description: '[Required] User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s execution history -e name',
    ],
  },
];

const executionList = [
  {
    header: 'Execution history',
    content: 'Call list executions to get all historical executions under a process',
  },
  {
    header: 'Options',
    optionList: [
      region,
      name,
      {
        name: 'execution-name',
        description: '[Required] User defined execution name. If you need to enter it, please ensure that it is unique under the process.',
        alias: 'e',
        type: String,
      },
      {
        name: 'status',
        description: '[Optional] The execution status of the filter you want to filter. The status supports the following fields: Running/Stopped/Succeeded/Failed/TimedOut.',
        type: String,
      },
    ],
  },
  { ...globalParams },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s execution list -e name',
    ],
  },
];

module.exports = {
  deploy,
  remove,
  list,
  schedule,
  scheduleGet,
  scheduleRemove,
  scheduleDeploy,
  scheduleList,
  execution,
  executionStart,
  executionStop,
  executionGet,
  executionHistory,
  executionList,
};