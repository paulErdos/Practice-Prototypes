import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql", // TODO: backend does not yet exist; edit after creating backend
  cache: new InMemoryCache()
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider>
          <Component {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </ApolloProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
