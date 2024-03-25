const COMMAND_HELP = {
  deploy: {
    help: {
      description: `Deploy cloud flow

Examples with Yaml:
  $ s deploy

Examples with CLI:
  $ s cli fnf deploy --region cn-hangzhou --name test --definition ./flow.yaml -a default`,
      summary: 'Deploy cloud flow',
      option: [
        ['-y, --assume-yes', 'Assume that the answer to any question which would be asked is yes'],
        ['--region <region>', '[C-Required] Specify CloudFlow region'],
        ['--name <flowName>', '[C-Required] Specify CloudFlow name'],
        ['--definition <definition>', '[C-Required] Specify CloudFlow template file path'],
        ['--description <description>', '[C-Required] Specify CloudFlow description'],
        [
          '--type FDL',
          '[C-Required] Specify CloudFlow type of the creation process, only FDL is available',
        ],
        [
          '--executionMode Standard',
          '[C-Required] Specify CloudFlow type of execution. The value is Standard or Express, default is Standard',
        ],
      ],
    },
  },

  remove: {
    help: {
      description: `Remove cloud flow.

Examples with Yaml:
  $ s remove

Examples with CLI:
  $ s cli fnf remove --region cn-hangzhou --name test -a default`,
      summary: 'Remove cloud flow',
      option: [
        ['--region <region>', '[C-Required] Specify CloudFlow region'],
        ['--name <flowName>', '[C-Required] Specify CloudFlow name'],
      ],
    },
  },

  info: {
    help: {
      description: `Get cloud flow info.

Examples with Yaml:
  $ s info

Examples with CLI:
  $ s cli fnf info --region cn-hangzhou --name test -a default`,
      summary: 'Get cloud flow info',
      option: [
        ['--region <region>', '[C-Required] Specify CloudFlow region'],
        ['--name <flowName>', '[C-Required] Specify CloudFlow name'],
      ],
    },
  },

  list: {
    help: {
      description: `List all cloud flows.

Examples with Yaml:
  $ s list

Examples with CLI:
  $ s cli fnf list --region cn-hangzhou -a default`,
      summary: 'List all cloud flows',
      option: [['--region <region>', '[C-Required] Specify CloudFlow region']],
    },
  },
};

export { COMMAND_HELP };
