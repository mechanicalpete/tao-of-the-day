import { handler } from "../src/select-daily-quote";
import { contextFactory, scheduledEventFactory } from "./utils";
import { getDailyQuoteForBook, getDynamoDBClient } from "../src/capabilities/capabilities-dynamodb";

describe('Select Daily Quote Handler', (): void => {

  describe('handler function', () => {
    it('Success Path', async () => {

      const event = scheduledEventFactory();
      const context = contextFactory();

      await handler(event, context);

      const dailyQuote = await getDailyQuoteForBook(getDynamoDBClient(), "BOOK#TaoTeChing");

      expect(dailyQuote).toBeDefined();
      expect(dailyQuote.PK).toEqual("DAILYQUOTE");
      expect(dailyQuote.bookTitle).toEqual("Tao Te Ching");
      expect(dailyQuote.bookAuthor).toEqual("Lao Tzu");
      expect(dailyQuote.quoteTitle).toBeDefined();
      expect(dailyQuote.quoteContent).toBeDefined();

    });
  });

});
