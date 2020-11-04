export const QOTD_DYNAMODB_TABLENAME: string = process.env.QOTD_DYNAMODB_TABLENAME || '@@camel-case-name@@';

export const MAIN_PRIMARYKEY = 'PK';
export const MAIN_SECONDARYKEY = 'SK';

export const GSI1_INDEXNAME = 'BookList';
export const GSI1_PRIMARYKEY = 'GSI1PK';
export const GSI1_SECONDARYKEY = 'GSI1SK';
