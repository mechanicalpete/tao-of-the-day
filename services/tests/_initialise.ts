import { CloudFormation, Config } from "aws-sdk";
import { CreateStackInput, Parameters } from "aws-sdk/clients/cloudformation";
import { BatchWriteItemOutput } from "aws-sdk/clients/dynamodb";
import fs from 'fs';
import { getDynamoDBClient } from "../src/capabilities/capabilities-dynamodb";
import { QOTD_DYNAMODB_TABLENAME } from "../src/constants";

const STACK_NAME_STORAGE = 'Storage';

export async function initialise(): Promise<void> {

    await initialiseViaCloudFormation();
    await seedDynamoDB();
}

async function initialiseViaCloudFormation(): Promise<void> {

    console.log('initialiseViaCloudFormation()');

    let client: CloudFormation;
    let configuration: AWS.CloudFormation.ClientConfiguration = new Config();

    configuration.endpoint = process.env.OVERRIDE_AWSSDK_ENDPOINT;
    configuration.credentials = { accessKeyId: 'string', secretAccessKey: 'string' };
    configuration.region = '@@aws-region-hub@@';

    client = new CloudFormation(configuration);

    const templateBody = fs.readFileSync('../infrastructure/tao-of-the-day-03-storage.yml', 'utf8');

    if (await stackExists(client, STACK_NAME_STORAGE)) {
        // await deleteStack(client, STACK_NAME_STORAGE);
        // await updateStack(client, STACK_NAME_STORAGE, templateBody, [{ ParameterKey: 'ParamDynamoDbQuotesTableName', ParameterValue: QOTD_DYNAMODB_TABLENAME }]);
    } else {
        await createStack(client, STACK_NAME_STORAGE, templateBody, [{ ParameterKey: 'ParamDynamoDbQuotesTableName', ParameterValue: QOTD_DYNAMODB_TABLENAME }]);
    }
}

async function stackExists(client: CloudFormation, StackName: string): Promise<boolean> {
    const existingStacks = await client.listStacks({}).promise();
    const existingStack = existingStacks.StackSummaries.find(stack => stack.StackName == StackName);
    return existingStack !== undefined;
}

// async function deleteStack(client: CloudFormation, StackName: string): Promise<void> {
//     const request: DeleteStackInput = { StackName };
//     // console.log(`Delete Request: ${JSON.stringify(request)}`);
//     await client.deleteStack(request).promise();
// }

async function createStack(client: CloudFormation, StackName: string, templateBody: string, Parameters: Parameters): Promise<void> {
    const request: CreateStackInput = {
        StackName,
        Parameters,
        TemplateBody: templateBody,
    };
    // console.log(`Create Request: ${JSON.stringify(request)}`);
    // const response: CreateStackOutput =
    await client.createStack(request).promise();
    // console.log(`Create Response: ${JSON.stringify(response)}`);
}
// async function updateStack(client: CloudFormation, StackName: string, templateBody: string, Parameters: Parameters): Promise<void> {
//     const request: UpdateStackInput = {
//         StackName,
//         Parameters,
//         TemplateBody: templateBody,
//     };
//     console.log(`Update Request: ${JSON.stringify(request)}`);
//     const response: UpdateStackOutput =
//         await client.updateStack(request).promise();
//     console.log(`Update Response: ${JSON.stringify(response)}`);
// }

async function seedDynamoDB() {
    console.log('seedDynamoDb()');
    const dynamodb = getDynamoDBClient();

    try {

        const response: BatchWriteItemOutput = await dynamodb.batchWriteItem({
            RequestItems: {
                [QOTD_DYNAMODB_TABLENAME]: [
                    // Book - Tao
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "BOOK#TaoTeChing" }, "Title": { "S": "Tao Te Ching" }, "Author": { "S": "Lao Tzu" }, "Type": { "S": "BOOK" }, "GSI1PK": { "S": "BOOK" }, "GSI1SK": { "S": "BOOK#TaoTeChing" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter01" }, "Title": { "S": "One" }, "Content": { "S": "The Tao that can be told is not the eternal Tao.\nThe name that can be named is not the eternal name.\nThe nameless is the beginning of heaven and Earth.\nThe named is the mother of the ten thousand things.\nEver desireless, one can see the mystery.\nEver desiring, one sees the manifestations.\nThese two spring from the same source but differ in name; this appears as darkness.\nDarkness within darkness.\nThe gate to all mystery." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter02" }, "Title": { "S": "Two" }, "Content": { "S": "Under heaven all can see beauty as beauty only because there is ugliness.\nAll can know good as good only because there is evil.\n\nTherefore having and not having arise together.\nDifficult and easy complement each other.\nLong and short contrast each other:\nHigh and low rest upon each other;\nVoice and sound harmonize each other;\nFront and back follow one another.\n\nTherefore the sage goes about doing nothing, teaching no-talking.\nThe ten thousand things rise and fall without cease,\nCreating, yet not possessing.\nWorking, yet not taking credit.\nWork is done, then forgotten.\nTherefore it lasts forever." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter03" }, "Title": { "S": "Three" }, "Content": { "S": "Not exalting the gifted prevents quarreling.\nNot collecting treasures prevents stealing.\nNot seeing desirable things prevents confusion of the heart.\n\nThe wise therefore rule by emptying hearts and stuffing bellies, by weakening ambitions and strengthening bones.\nIf men lack knowledge and desire, then clever people will not try to interfere.\nIf nothing is done, then all will be well." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter04" }, "Title": { "S": "Four" }, "Content": { "S": "The Tao is an empty vessel; it is used, but never filled.\nOh, unfathomable source of ten thousand things!\nBlunt the sharpness,\nUntangle the knot,\nSoften the glare,\nMerge with dust.\nOh, hidden deep but ever present!\nI do not know from whence it comes.\nIt is the forefather of the gods." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter05" }, "Title": { "S": "Five" }, "Content": { "S": "Heaven and Earth are impartial;\nThey see the ten thousand things as straw dogs.\nThe wise are impartial;\nThey see the people as straw dogs.\n\nThe space between heaven and Earth is like a bellows.\nThe shape changes but not the form;\nThe more it moves, the more it yields.\nMore words count less.\nHold fast to the center." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter06" }, "Title": { "S": "Six" }, "Content": { "S": "The valley spirit never dies;\nIt is the woman, primal mother.\nHer gateway is the root of heaven and Earth.\nIt is like a veil barely seen.\nUse it; it will never fail." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter07" }, "Title": { "S": "Seven" }, "Content": { "S": "Heaven and Earth last forever.\nWhy do heaven and Earth last forever?\nThey are unborn,\nSo ever living.\nThe sage stays behind, thus he is ahead.\nHe is detached, thus at one with all.\nThrough selfless action, he attains fulfillment." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter08" }, "Title": { "S": "Eight" }, "Content": { "S": "The highest good is like water.\nWater give life to the ten thousand things and does not strive.\nIt flows in places men reject and so is like the Tao.\n\nIn dwelling, be close to the land.\nIn meditation, go deep in the heart.\nIn dealing with others, be gentle and kind.\nIn speech, be true.\nIn ruling, be just.\nIn daily life, be competent.\nIn action, be aware of the time and the season.\n\nNo fight: No blame." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter09" }, "Title": { "S": "Nine" }, "Content": { "S": "Better to stop short than fill to the brim.\nOversharpen the blade, and the edge will soon blunt.\nAmass a store of gold and jade, and no one can protect it.\nClaim wealth and titles, and disaster will follow.\nRetire when the work is done.\nThis is the way of heaven." }, "Type": { "S": "QUOTE" } } } },
                    { PutRequest: { Item: { "PK": { "S": "BOOK#TaoTeChing" }, "SK": { "S": "QUOTE#TaoTeChing#Chapter10" }, "Title": { "S": "Ten" }, "Content": { "S": "Carrying body and soul and embracing the one,\nCan you avoid separation?\nAttending fully and becoming supple,\nCan you be as a newborn babe?\nWashing and cleansing the primal vision,\nCan you be without stain?\nLoving all men and ruling the country,\nCan you be without cleverness?\nOpening and closing the gates of heaven,\nCan you play the role of woman?\nUnderstanding and being open to all things,\nAre you able to do nothing?\nGiving birth and nourishing,\nBearing yet not possessing,\nWorking yet not taking credit,\nLeading yet not dominating,\nThis is the Primal Virtue." }, "Type": { "S": "QUOTE" } } } },
                ]
            }
        }).promise();
        console.log(`Batch Write Response: ${JSON.stringify(response)}`);

    }
    catch (error) {
        console.error(`Caught an error: ${error}`);
        throw error
    }
}
