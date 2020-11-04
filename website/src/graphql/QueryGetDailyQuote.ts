import gql from "graphql-tag";

export default gql(`
query GetDailyQuote {
    getDailyQuote(bookId: "BOOK#TaoTeChing") {
      BookTitle
      BookAuthor
      QuoteTitle
      QuoteContent
    }
  }
`);
