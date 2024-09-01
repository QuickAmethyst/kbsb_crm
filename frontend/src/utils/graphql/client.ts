import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';

import config from '@/utils/config';
import authMiddleware from './middleware/authMiddleware';

const httpLink = createHttpLink({
  uri: config.graphqlUrl,
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authMiddleware,
    httpLink,
  ]),
  cache: new InMemoryCache(),
});

export default client;
