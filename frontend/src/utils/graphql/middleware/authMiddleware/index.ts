import { getOrganizationCookie } from '@/utils/cookies/organization';
import routes from '@/utils/routes';
import { ApolloLink } from '@apollo/client';
import router from 'next/router';

const authMiddleware = new ApolloLink((operation, forward) => {
  const organizationCookie = getOrganizationCookie();

  if (organizationCookie === null) {
    router.replace(routes.signIn);
    return forward(operation);
  }
  
  const { id } = organizationCookie;

  operation.setContext(({ headers }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      'x-organization-id': id,
    },
  }));

  return forward(operation);
});

export default authMiddleware;
