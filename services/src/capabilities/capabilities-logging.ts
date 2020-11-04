import { Context } from "aws-lambda";

export function recordLambdaEntry(sourceEvent: any, context: Context): void {
    /* istanbul ignore next */
    console.log(`${context.functionName}`, JSON.stringify(sourceEvent), JSON.stringify(context));
}

export function generateCloudWatchLogsUrl(context: Context): string {

    const logGroupName = context.logGroupName;
    const logStreamName = context.logStreamName.replace('[', '%5B').replace(']', '%5D');
    const awsRequestId = context.awsRequestId

    return `https://@@aws-region-hub@@.console.aws.amazon.com/cloudwatch/home?region=@@aws-region-hub@@#logEventViewer:group=${logGroupName};stream=${logStreamName};filter=%22${awsRequestId}%22`;
}