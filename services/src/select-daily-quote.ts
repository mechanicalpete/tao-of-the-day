const AWSXRay = require('aws-xray-sdk');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

import { Context, ScheduledEvent } from 'aws-lambda';
import { Segment, Subsegment } from 'aws-xray-sdk-core';
import "source-map-support/register";
import { recordLambdaEntry } from './capabilities/capabilities-logging';
import { closeSegment, closeSubsegment, startSubSegment, storeCloudWatchLogsUrl } from './capabilities/capabilities-xray';
import { queryIndexByPrimaryKey, getDynamoDBClient, queryMainByPrimaryKeyAndSortKeyPrefix, putDailyQuoteForBook } from './capabilities/capabilities-dynamodb';
import { GSI1_INDEXNAME, GSI1_PRIMARYKEY } from './constants';
import { BookListItem, QuoteItem } from './type';

AWS.config.logger = console;

export async function handler(event: ScheduledEvent, context: Context): Promise<void> {

    recordLambdaEntry(event, context);

    const segment: Segment = AWSXRay.getSegment();
    let subsegment: Subsegment | undefined;

    try {

        storeCloudWatchLogsUrl(segment, context);
        subsegment = startSubSegment(segment, 'select-daily-quote');

        const dynamoDbClient = getDynamoDBClient();

        // Load book-list from DynamoDB (BookList gsi)
        let quotes: QuoteItem[];
        const bookList: BookListItem[] = await queryIndexByPrimaryKey(dynamoDbClient, GSI1_INDEXNAME, GSI1_PRIMARYKEY, 'BOOK');

        if(bookList === undefined || bookList.length === 0 ){
            throw new Error('No books found!');
        }

        for (const book of bookList) {
            console.log(`Picking a quote from ${book.title}`);
            //  query main index where PK = bookId
            quotes = await queryMainByPrimaryKeyAndSortKeyPrefix(dynamoDbClient, book.PK, 'QUOTE#');
            console.log(`Found quotes: ${JSON.stringify(quotes)}`)

            if (quotes && quotes.length > 0) {
                //  randomly select a record where the SK starts with QUOTE
                const index = Math.trunc(Math.random() * quotes.length);
                console.log(`Chosen index ${index}`);
                const quote = quotes[index];
                console.log(`Chosen quote ${JSON.stringify(quote)}`);

                //  write DailyQuote record
                await putDailyQuoteForBook(dynamoDbClient, book, quote);
            }
        }

        closeSubsegment(subsegment);

    } catch (error) {
        console.error(error);
        if (subsegment && !subsegment.isClosed()) {
            subsegment.addError(error);
        }
        throw error; // rethrow the error so the lambda gets recorded as a failure.
    } finally {
        closeSubsegment(subsegment);
        closeSegment(segment);
    }
}
