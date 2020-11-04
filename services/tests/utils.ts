import { Context, ScheduledEvent } from "aws-lambda";

export function contextFactory(logStreamName: string = "logStreamName"): Context {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "functionName",
    functionVersion: "functionVersion",
    invokedFunctionArn: "invokedFunctionArn",
    memoryLimitInMB: "memoryLimitInMB",
    awsRequestId: "awsRequestId",
    logGroupName: "logGroupName",
    logStreamName,

    getRemainingTimeInMillis(): number {
      return -1;
    },

    done(_error?: Error, _result?: any): void { },
    fail(_error: Error | string): void { },
    succeed(_messageOrObject: any): void { }
  };
}

export function scheduledEventFactory(): ScheduledEvent {
  return {
    id: 'string',
    version: 'string',
    account: 'string',
    time: 'string',
    region: 'string',
    resources: [],
    source: 'string',
    "detail-type": 'Scheduled Event',
    detail: 'TDetail',
  };
}
