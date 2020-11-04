import * as AWS from 'aws-sdk';
import { Config, DynamoDB } from 'aws-sdk';
import { AttributeMap, GetItemInput, GetItemOutput, PutItemInput, PutItemOutput, QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { MAIN_PRIMARYKEY, MAIN_SECONDARYKEY, QOTD_DYNAMODB_TABLENAME } from '../constants';
import { BookListItem, DailyQuoteItem, QuoteItem } from '../type';

let dynamoDbClient: DynamoDB;
export function getDynamoDBClient(): DynamoDB {

    console.log('getDynamoDBClient()');

    /* istanbul ignore next */
    if (!dynamoDbClient) {
        let configurationDynamoDB: AWS.DynamoDB.ClientConfiguration = new Config();

        configurationDynamoDB.apiVersion = '2012-08-10';
        /* istanbul ignore next */ // Overrides for local testing with localstack
        if (process.env.OVERRIDE_AWSSDK_ENDPOINT) {
            configurationDynamoDB.endpoint = process.env.OVERRIDE_AWSSDK_ENDPOINT;
            configurationDynamoDB.credentials = { accessKeyId: 'string', secretAccessKey: 'string' };
            configurationDynamoDB.region = '@@aws-region-hub@@';
        }

        dynamoDbClient = new DynamoDB(configurationDynamoDB);
    }

    return dynamoDbClient;
}

export async function queryIndexByPrimaryKey(client: DynamoDB, indexName: string, primaryKeyField: string, primaryKeyValue: string): Promise<BookListItem[]> {
    console.log('queryIndexByPrimaryKey()');

    let bookList: BookListItem[] = [];
    let response: QueryOutput;
    const request: QueryInput = {
        TableName: QOTD_DYNAMODB_TABLENAME,
        IndexName: indexName,
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': primaryKeyField },
        ExpressionAttributeValues: { ':pk': { S: primaryKeyValue } }
    };

    do {
        console.log(`Request: ${JSON.stringify(request)}`);
        response = await client.query(request).promise();
        console.log(`Response: ${JSON.stringify(response)}`);

        bookList = bookList.concat(mapResponseToBookListItem(response));

        if (response.LastEvaluatedKey) {
            request.ExclusiveStartKey = response.LastEvaluatedKey;
        }
    } while (response.LastEvaluatedKey !== undefined)

    return bookList;
}

export async function queryMainByPrimaryKeyAndSortKeyPrefix(client: DynamoDB, primaryKeyValue: string, sortKeyPrefix: string): Promise<QuoteItem[]> {
    console.log('queryMainByPrimaryKeyAndSortKeyPrefix()');

    let quotes: QuoteItem[] = [];
    let response: QueryOutput;
    const request: QueryInput = {
        TableName: QOTD_DYNAMODB_TABLENAME,
        KeyConditionExpression: '#pk = :pk AND begins_with( #sk, :sk )',
        ExpressionAttributeNames: {
            '#pk': MAIN_PRIMARYKEY,
            '#sk': MAIN_SECONDARYKEY
        },
        ExpressionAttributeValues: {
            ':pk': { S: primaryKeyValue },
            ':sk': { S: sortKeyPrefix }
        }
    };

    do {
        console.log(`Request: ${JSON.stringify(request)}`);
        response = await client.query(request).promise();
        console.log(`Response: ${JSON.stringify(response)}`);

        quotes = quotes.concat(mapResponseToQuoteItem(response));

        if (response.LastEvaluatedKey) {
            request.ExclusiveStartKey = response.LastEvaluatedKey;
        }
    } while (response.LastEvaluatedKey !== undefined)

    return quotes;
}

export async function putDailyQuoteForBook(client: DynamoDB, book: BookListItem, quote: QuoteItem): Promise<void> {
    console.log('putDailyQuoteForBook()');

    const request: PutItemInput = {
        TableName: QOTD_DYNAMODB_TABLENAME,
        Item: {
            'PK': { S: 'DAILYQUOTE' },
            'SK': { S: book.PK },
            'BookTitle': { S: book.title },
            'BookAuthor': { S: book.author },
            'QuoteTitle': { S: quote.title },
            'QuoteContent': { S: quote.content },
        }
    }
    console.log(`Request: ${JSON.stringify(request)}`);
    const response: PutItemOutput = await client.putItem(request).promise();
    console.log(`Response: ${JSON.stringify(response)}`);
}

export async function getDailyQuoteForBook(client: DynamoDB, bookId: string): Promise<DailyQuoteItem> {
    console.log('getDailyQuoteForBook()');

    const request: GetItemInput = {
        TableName: QOTD_DYNAMODB_TABLENAME,
        Key: {
            'PK': { S: 'DAILYQUOTE' },
            'SK': { S: bookId },
        }
    }
    console.log(`Request: ${JSON.stringify(request)}`);
    const response: GetItemOutput = await client.getItem(request).promise();
    console.log(`Response: ${JSON.stringify(response)}`);

    return mapResponseToDailyQuoteItem(response);
}

export function mapResponseToBookListItem(response: QueryOutput): BookListItem[] {
    const bookList: BookListItem[] = [];

    if (response.Items) {
        for (const item of response.Items) {
            if (item) {

                let bookListItem: BookListItem = {
                    PK: safeGetValue(item, 'PK'),
                    SK: safeGetValue(item, 'SK'),
                    GSI1PK: safeGetValue(item, 'GSI1PK'),
                    GSI1SK: safeGetValue(item, 'GSI1SK'),
                    title: safeGetValue(item, 'Title'),
                    author: safeGetValue(item, 'Author')
                };
                bookList.push(bookListItem);
            }
        }
    }

    return bookList;
}

export function mapResponseToQuoteItem(response: QueryOutput): QuoteItem[] {
    const quotes: QuoteItem[] = [];

    if (response.Items) {
        for (const item of response.Items) {
            if (item) {
                let quoteItem: QuoteItem = {
                    PK: safeGetValue(item, 'PK'),
                    SK: safeGetValue(item, 'SK'),
                    title: safeGetValue(item, 'Title'),
                    content: safeGetValue(item, 'Content')
                };
                quotes.push(quoteItem);
            }
        }
    }

    return quotes;
}

export function mapResponseToDailyQuoteItem(response: GetItemOutput): DailyQuoteItem {
    let dailyQuote: DailyQuoteItem;

    if (response.Item) {
        dailyQuote = {
            PK: safeGetValue(response.Item, 'PK'),
            SK: safeGetValue(response.Item, 'SK'),
            bookTitle: safeGetValue(response.Item, 'BookTitle'),
            bookAuthor: safeGetValue(response.Item, 'BookAuthor'),
            quoteTitle: safeGetValue(response.Item, 'QuoteTitle'),
            quoteContent: safeGetValue(response.Item, 'QuoteContent'),
        };
    } else {
        dailyQuote = undefined;
    }

    return dailyQuote;
}

function safeGetValue(item: AttributeMap, field: string): string | undefined {
    let value: string | undefined = undefined;
    if (item) {
        if (item[field] && item[field].S) {
            value = item[field].S;
        }
    }

    return value
}