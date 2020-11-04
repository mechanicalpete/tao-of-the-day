export interface CallbackResponse {
    statusCode: number;
    headers?: {
        [key: string]: string
    }
    body?: string;
}

export interface MainIndexKeys {
    PK: string;
    SK: string;
}

export interface GlobalSecondaryIndex1Keys {
    GSI1PK: string;
    GSI1SK: string;
}

export interface BookListItem extends MainIndexKeys, GlobalSecondaryIndex1Keys {
    author: string;
    title: string;
}

export interface QuoteItem extends MainIndexKeys {
    title: string;
    content: string;
}

export interface DailyQuoteItem extends MainIndexKeys {
    bookTitle: string;
    bookAuthor: string;
    quoteTitle: string;
    quoteContent: string;
}
