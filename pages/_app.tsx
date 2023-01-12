import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import { NextComponentType } from 'next';
import AuthGuard from '../components/AuthGuard';
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme
} from '@mantine/core';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageLayout from '../components/PageLayout';

export type CustomAppProps = AppProps & {
  Component: NextComponentType & { requireAuth?: boolean };
};

export const queryClient = new QueryClient();


export default function App({
  Component,
  pageProps: { session, ...pageProps } }: CustomAppProps) {

  const [colorScheme, setcolorScheme] = useState<ColorScheme>(
    "dark"
  );
  const toggleColorScheme = (value?: ColorScheme) =>
    setcolorScheme(value || (colorScheme === "dark" ? "light" : "dark"));


  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: colorScheme }}>
          <SessionProvider
            session={session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus>
            {Component.requireAuth ? (
              <AuthGuard>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </AuthGuard>) : (
              <Component{...pageProps} />
            )}
            <ReactQueryDevtools position='bottom-right' />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
