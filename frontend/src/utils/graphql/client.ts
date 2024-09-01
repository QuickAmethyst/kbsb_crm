import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';

import config from '@/utils/config';

const httpLink = createHttpLink({
  uri: config.graphqlUrl,
});

const client = new ApolloClient({
  link: ApolloLink.from([
    httpLink,
  ]),
  cache: new InMemoryCache(),
});

export default client;
