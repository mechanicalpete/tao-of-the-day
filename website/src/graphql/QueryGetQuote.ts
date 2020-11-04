import gql from "graphql-tag";

export default gql(`
query getQuote {
  getQuote(bookId: "BOOK#TaoTeChing", quoteId: "QUOTE#TaoTeChing#Chapter01") {
    Title
    Content
  }
}
`);
