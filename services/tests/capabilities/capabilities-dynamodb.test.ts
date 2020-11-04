import { DynamoDB } from "aws-sdk";
import { getDynamoDBClient, queryMainByPrimaryKeyAndSortKeyPrefix } from "../../src/capabilities/capabilities-dynamodb";

let client: DynamoDB;

describe('Verify DynamoDB capabilities', (): void => {

    beforeEach(() => {
        if (client === undefined) {
            client = getDynamoDBClient();
        }
    });


    describe('verify function \'queryMainByPrimaryKeyAndSortKeyPrefix\'', () => {

        it('returns results', async () => {

            const results = await queryMainByPrimaryKeyAndSortKeyPrefix(client, 'BOOK#TaoTeChing', 'QUOTE#');
            expect(results).toBeDefined();
            expect(results.length).toEqual(10);
        });
    });

});
