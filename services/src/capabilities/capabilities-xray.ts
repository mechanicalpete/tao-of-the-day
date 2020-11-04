import { Context } from 'aws-lambda';
import { Segment, Subsegment } from 'aws-xray-sdk-core';
import { generateCloudWatchLogsUrl } from './capabilities-logging';

export function startSubSegment(segment: Segment, subsegmentName: string): Subsegment {
    return segment.addNewSubsegment(subsegmentName);
}

export function closeSubsegment(subsegment: Subsegment | undefined): void {
    if (subsegment !== undefined) {
        if (!subsegment.isClosed()) {
            subsegment.close();
        }
    }
}

export function closeSegment(segment: Segment | undefined): void {
    if (segment !== undefined) {
        if (!segment.isClosed()) {
            segment.close();
        }
    }
}

export function storeCloudWatchLogsUrl(segment: Segment, context: Context): void {
    let subsegment: Subsegment;
    subsegment = startSubSegment(segment, 'cloudwatch-url');
    subsegment.addMetadata('cloudwatch-url', generateCloudWatchLogsUrl(context));
    subsegment.addAnnotation('cloudwatch-url', generateCloudWatchLogsUrl(context));
    subsegment.addAttribute('cloudwatch-url', generateCloudWatchLogsUrl(context));
    closeSubsegment(subsegment);
}
