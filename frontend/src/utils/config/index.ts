const config = {
  isDev: process.env.NEXT_PUBLIC_APP_ENV !== 'production',
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL,
};

export default config;
