import FnfBase from './base';

export class FnfSchedule extends FnfBase {
  async add() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const cron = comParse.data.cron || comParse.data.c || undefined;
    const scheduleName = comParse.data.scheduleName || comParse.data.s || undefined;
    const description = comParse.data.description || comParse.data.d || undefined;
    const payload = comParse.data.payload || comParse.data.p || undefined;
    const enable = comParse.data.enable || comParse.data.e || undefined;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (cron) {
      body.CronExpression = cron;
    }

    if (scheduleName) {
      body.ScheduleName = scheduleName;
    }

    if (description) {
      body.Description = description;
    }

    if (payload) {
      body.Payload = JSON.parse(payload);
    }

    if (enable) {
      body.Enable = enable;
    }

    const createScheduleResponse: any = await new Promise((resolve, reject) => {
      client.request('CreateSchedule', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      ScheduleName: createScheduleResponse.ScheduleName,
      ScheduleId: createScheduleResponse.ScheduleId,
      CronExpression: createScheduleResponse.CronExpression,
      LastModifiedTime: createScheduleResponse.LastModifiedTime,
    };
  }

  async update() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const cron = comParse.data.cron || comParse.data.c || undefined;
    const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined;
    const description = comParse.data.description || comParse.data.d || undefined;
    const payload = comParse.data.payload || comParse.data.p || undefined;
    const enable = comParse.data.enable || comParse.data.e || undefined;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let body: any = {
      RegionId: region,
      FlowName: comParse.data.name || comParse.data.n || inputs.props.name,
    };

    if (cron) {
      body.CronExpression = cron;
    }

    if (scheduleName) {
      body.ScheduleName = scheduleName;
    }

    if (description) {
      body.Description = description;
    }

    if (payload) {
      body.Payload = JSON.parse(payload);
    }

    if (enable) {
      body.Enable = enable;
    }

    const updateScheduleResponse: any = await new Promise((resolve, reject) => {
      client.request('UpdateSchedule', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      ScheduleName: updateScheduleResponse.ScheduleName,
      ScheduleId: updateScheduleResponse.ScheduleId,
      CronExpression: updateScheduleResponse.CronExpression,
      LastModifiedTime: updateScheduleResponse.LastModifiedTime,
    };
  }

  async list() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const limit = comParse.data.limit || comParse.data.l || 50;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (limit) {
      body.Limit = limit;
    }

    const listScheduleResponse: any = await new Promise((resolve, reject) => {
      client.request('ListSchedules', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      Scheduled: listScheduleResponse.Schedules,
    };
  }

  async delete() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;

    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (scheduleName) {
      body.ScheduleName = scheduleName;
    }

    await new Promise((resolve, reject) => {
      client.request('DeleteSchedule', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      ScheduleName: scheduleName,
    };
  }

  async get() {
    const comParse = this.comParse;
    const inputs = this.inputs;
    const defaultOpt = this.defaultOpt;
    const client = await this.getClient();
    const region = this.region;

    const scheduleName = comParse.data['schedule-name'] || comParse.data.s || undefined;
    const name = comParse.data.name || comParse.data.n || inputs.props.name;
    let body: any = {
      RegionId: region,
      FlowName: name,
    };

    if (scheduleName) {
      body.ScheduleName = scheduleName;
    }

    const descResult: any = await new Promise((resolve, reject) => {
      client.request('DescribeSchedule', body, defaultOpt).then(
        (result) => {
          resolve(result);
        },
        (ex) => {
          reject(ex);
        },
      );
    });

    return {
      RegionId: region,
      FlowName: name,
      CreatedTime: descResult.CreatedTime,
      CronExpression: descResult.CronExpression,
      LastModifiedTime: descResult.LastModifiedTime,
      Enable: descResult.Enable,
      Description: descResult.Description,
    };
  }
}
