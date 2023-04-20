const { lodash: _, help: showHelp } = require('@serverless-devs/core');
const log = require('./common/log');
const { commandParse, getCredentials } = require('./util');
const help = require('./help');
const Fnf = require('./fnf');

class FnfComponent {
	async deploy(inputs) {
		const comParse = commandParse(inputs);
		log.debug(`Deploying commandParse result: ${JSON.stringify(comParse)}`);
		if (comParse.help) {
			showHelp(help.deploy);
			return;
		}
		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'))
		log.info("Start deploy workflow ... ");
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const definition = _.get(comParse, 'definition') || _.get(inputs, 'props.definition');
		const description = _.get(comParse, 'description') || _.get(inputs, 'props.description', 'Create By Serverless Devs');
		const type = _.get(comParse, 'type') || _.get(inputs, 'props.type', 'FDL');

		const fnf = new Fnf(credential, region);
		await fnf.deploy({
			RegionId: region,
			Name: name,
			Description: description,
			Type: type,
			Definition: Fnf.getDefinition(definition),
			RoleArn: Fnf.getRoleArn(_.get(inputs, 'props.roleArn', ''), credential.AccountID),
		});
		return {
			RegionId: region,
			Name: name,
		};
	}

	async remove(inputs) {
		const comParse = commandParse(inputs);
		if (comParse.help) {
			showHelp(help.remove);
			return;
		}
		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');

		const fnf = new Fnf(credential, region);
		await fnf.remove({
			RegionId: region,
			Name: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
		});
	}

	async list(inputs) {
		const comParse = commandParse(inputs);
		if (comParse.help) {
			showHelp(help.list);
			return;
		}

		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const fnf = new Fnf(credential, region);
		return await fnf.list({
			RegionId: region,
			Limit: 100,
		});
	}

	async execution(inputs) { 
		const comParse = commandParse(inputs);
		const subCommand = _.get(comParse, '_[0]');

		switch (subCommand) {
			case 'start':
				return await this.execution_start(inputs);
			case 'stop':
				return await this.execution_stop(inputs);
			case 'history':
				return await this.execution_history(inputs);
			case 'get':
				return await this.execution_get(inputs);
			case 'list':
				return await this.execution_list(inputs);
			default:
				showHelp(help.execution);
				if (!comParse.help) {
					throw new Error(`The subCommand ${subCommand || ''} does not support`);
				}
		}
	}

	async schedule(inputs) {
		const comParse = commandParse(inputs);
		const subCommand = _.get(comParse, '_[0]');

		switch (subCommand) {
			case 'get':
				return await this.schedule_get(inputs);
			case 'list':
				return await this.schedule_list(inputs);
			case 'deploy':
				return await this.schedule_deploy(inputs);
			case 'remove':
				return await this.schedule_remove(inputs);
			case 'add':
				return await this.schedule_add(inputs);
			case 'update':
				return await this.schedule_update(inputs);
			case 'delete':
				return await this.schedule_delete(inputs);
			default:
				showHelp(help.schedule);
				if (!comParse.help) {
					throw new Error(`The subCommand ${subCommand || ''} does not support`);
				}
		}
	}

	async execution_start(inputs) {
		const comParse = commandParse(inputs, { alias: { 'execution-name': 'e', inputs: 'i' } });
		if (comParse.help) {
			showHelp(help.executionStart);
			return;
		}

		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		
		const fnf = new Fnf(credential, region);
		return await fnf.startExecution({
			RegionId: region,
			FlowName: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
			ExecutionName: _.get(comParse, 'execution-name'),
			Input: Fnf.getExecutionInput(comParse),
		});
	}

	async execution_stop(inputs) {
		const comParse = commandParse(inputs, { alias: { 'execution-name': 'e', cause: 'c' } });
		if (comParse.help) {
			showHelp(help.executionStop);
			return;
		}

		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		
		const fnf = new Fnf(credential, region);
		return await fnf.stopExecution({
			RegionId: region,
			FlowName: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
			ExecutionName: _.get(comParse, 'execution-name'),
			Cause: _.get(comParse, 'cause'),
			Error: _.get(comParse, 'error'),
		});
	}

	async execution_get(inputs) {
		const comParse = commandParse(inputs, { number: ['wait'], alias: { 'execution-name': 'e', wait: 'w' } });
		if (comParse.help) {
			showHelp(help.executionGet);
			return;
		}

		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		
		const fnf = new Fnf(credential, region);
		return await fnf.describeExecution({
			RegionId: region,
			FlowName: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
			ExecutionName: _.get(comParse, 'execution-name'),
			WaitTimeSeconds: _.get(comParse, 'wait', 0),
		});
	}

	async execution_history(inputs) {
		const comParse = commandParse(inputs, { alias: { 'execution-name': 'e' } });
		if (comParse.help) {
			showHelp(help.executionHistory);
			return;
		}

		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		
		const fnf = new Fnf(credential, region);
		return await fnf.getExecutionHistory({
			RegionId: region,
			FlowName: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
			ExecutionName: _.get(comParse, 'execution-name'),
		});
	}

	async execution_list(inputs) {
		const comParse = commandParse(inputs, { alias: { 'execution-name': 'e', filter: 'f' } });
		if (comParse.help) {
			showHelp(help.executionList);
			return;
		}

		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		
		const fnf = new Fnf(credential, region);
		return await fnf.listExecutions({
			RegionId: region,
			FlowName: _.get(comParse, 'name') || _.get(inputs, 'props.name'),
			ExecutionName: _.get(comParse, 'execution-name'),
			Status: _.get(comParse, 'filter') || _.get(comParse, 'status', ''),
		});
	}

	async schedule_remove(inputs) {
		const comParse = commandParse(inputs, { alias: { 'schedule-mame': 's' } });
		if (comParse.help) {
			showHelp(help.scheduleRemove);
			return;
		}
		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const scheduleName = _.get(comParse, 'schedule-mame');
		const fnf = new Fnf(credential, region);
		const p = {
			RegionId: region,
			FlowName: name,
			ScheduleName: scheduleName,
		};
		const result = await fnf.deleteSchedule(p);
		return { ...result, ...p };
	}
	async schedule_deploy(inputs) {
		const comParse = commandParse(inputs, {
			booleab: ['enable'],
			alias: {
				'schedule-mame': 's',
				cron: 'c',
				payload: 'p',
				enable: 'e',
			},
		});
		if (comParse.help) {
			log.info('Show deploy help:');
			showHelp(help.scheduleDeploy);
			return;
		}
		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');

		const fnf = new Fnf(credential, region);
		const result = await fnf.deploySchedule({ ...comParse, name, region });
		return result;
	}
	async schedule_get(inputs) {
		const comParse = commandParse(inputs, { alias: { 'schedule-mame': 's' } });
		if (comParse.help) {
			showHelp(help.scheduleGet);
			return;
		}

		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const scheduleName = _.get(comParse, 'schedule-mame');
		const fnf = new Fnf(credential, region);
		return await fnf.describeSchedule({
			RegionId: region,
			FlowName: name,
			ScheduleName: scheduleName,
		});
	}
	async schedule_list(inputs) {
		const comParse = commandParse(inputs);
		if (comParse.help) {
			showHelp(help.scheduleList);
			return;
		}

		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const fnf = new Fnf(credential, region);
		return await fnf.listSchedules({
			RegionId: region,
			FlowName: name,
		});
	}
	/**
	 * @deprecated This method will be removed in future versions. Use schedule_deploy instead.
	 */
	async schedule_add(inputs) {
		log.warn('Add has been deprecated, please use deploy');
		const comParse = commandParse(inputs, {
			booleab: ['enable'],
			alias: {
				'schedule-mame': 's',
				cron: 'c',
				payload: 'p',
				enable: 'e',
			},
		});
		if (comParse.help) {
			log.info('Show deploy help:');
			showHelp(help.scheduleDeploy);
			return;
		}
		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const scheduleName = _.get(comParse, 'schedule-mame');
		const cron = _.get(comParse, 'cron', '@every 1440m');
		const description = _.get(comParse, 'description', '');
		const payload = _.get(comParse, 'payload', '{"key":"value"}');
		const enable = _.get(comParse, 'enable', false);

		const fnf = new Fnf(credential, region);
		const result = await fnf.createSchedule({
			RegionId: region,
			FlowName: name,
			ScheduleName: scheduleName,
			CronExpression: cron,
			Description: description,
			Payload: payload,
			Enable: enable,
		});
		return result;
	}
	/**
	 * @deprecated This method will be removed in future versions. Use schedule_deploy instead.
	 */
	async schedule_update(inputs) {
		log.warn('Update has been deprecated, please use deploy');
		const comParse = commandParse(inputs, {
			booleab: ['enable'],
			alias: {
				'schedule-mame': 's',
				cron: 'c',
				payload: 'p',
				enable: 'e',
			},
		});
		if (comParse.help) {
			log.info('Show deploy help:');
			showHelp(help.scheduleDeploy);
			return;
		}

		// 获取密钥信息
		const credential = await getCredentials(_.get(inputs, 'credentials'), _.get(inputs, 'project.access'));
		const region = _.get(comParse, 'region') || _.get(inputs, 'props.region', 'cn-hangzhou');
		const name = _.get(comParse, 'name') || _.get(inputs, 'props.name');
		const scheduleName = _.get(comParse, 'schedule-mame');
		const cron = _.get(comParse, 'cron', '@every 1440m');
		const description = _.get(comParse, 'description', '');
		const payload = _.get(comParse, 'payload', '{"key":"value"}');
		const enable = _.get(comParse, 'enable', false);

		const fnf = new Fnf(credential, region);
		const result = await fnf.updateSchedule({
			RegionId: region,
			FlowName: name,
			ScheduleName: scheduleName,
			CronExpression: cron,
			Description: description,
			Payload: payload,
			Enable: enable,
		});
		return result;
	}
	/**
	 * @deprecated This method will be removed in future versions. Use schedule_remove instead.
	 */
	async schedule_delete(inputs) {
		log.warn('delete has been deprecated, please use remove');
		return await this.schedule_remove(inputs);
	}
}

module.exports = FnfComponent;