import globalStyle from "@/styles/globalStyle";
import client from "@/utils/graphql/client";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />

      <style jsx global>
        {globalStyle}
      </style>
    </ApolloProvider>
  );
}
