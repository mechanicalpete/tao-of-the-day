import { useQuery } from '@apollo/react-hooks';
import React from "react";
import QueryGetDailyQuote from "./graphql/QueryGetDailyQuote";

const DailyQuote = () => {

    const {
        data: dailyQuote,
        loading: getQuoteLoading,
        error: getQuoteError
    } = useQuery(QueryGetDailyQuote, {});

    if (getQuoteLoading) {
        return <p>Daily Tao Loading...</p>;
    } else if (getQuoteError) {
        return <p>ERROR: There was a problem retrieving the Daily Tao. Please try again soon</p>;
    } else if (!dailyQuote || !dailyQuote.getDailyQuote) {
        return <p>No Daily Tao found</p>;
    } else {
        return (
            <div>
                <h1>{dailyQuote.getDailyQuote.BookTitle} by {dailyQuote.getDailyQuote.BookAuthor}</h1>
                <h2>{dailyQuote.getDailyQuote.QuoteTitle}</h2>
                {
                    dailyQuote.getDailyQuote.QuoteContent.split('\n').map((item: string, key: string) => {
                        return <p key={key}>{item}</p>
                    })}
            </div>
        );
    }
}

export default DailyQuote;