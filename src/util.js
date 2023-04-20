const core = require('@serverless-devs/core');
const _ = core.lodash;

const APTS = {
	boolean: ['help'],
	alias: { help: 'h', region: 'r', name: 'n' },
}; 


const commandParse = (inputs, apts = {}) => {
  const comParse = core.commandParse(inputs, _.mergeWith(apts, APTS));
  return _.get(comParse, 'data', {});
};

async function getCredentials(credentials, access) {
  if (_.isEmpty(credentials)) {
    return await core.getCredential(access);
  }
  return credentials;
}

module.exports = { commandParse, getCredentials };
