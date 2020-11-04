import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloLink } from 'apollo-link';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from 'apollo-link-http';
import appSyncConfig from "./aws-exports";
import ApolloClient from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";
import { AUTH_TYPE } from "aws-appsync";
import DailyQuote from './DailyQuote';

const url = appSyncConfig.aws_appsync_graphqlEndpoint;
const region = appSyncConfig.aws_appsync_region;
const auth = {
  type: appSyncConfig.aws_appsync_authenticationType as AUTH_TYPE.API_KEY,
  apiKey: appSyncConfig.aws_appsync_apiKey
};
const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createHttpLink({ uri: url })
]);
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Router>
          <Switch>
            <Route exact path="/">
              <DailyQuote />
            </Route>
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  )
};

export default App;
