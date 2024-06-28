import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../../theme';
import '@mantine/core/styles.css';

export const metadata = {
  title: 'KC Permissions Dashboard',
  description:
    'A website for viewing and applying for permisions on the Karma Company Liberation Server!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialColorScheme = 'dark';

  return (
    <html lang="en" data-mantine-color-scheme={initialColorScheme}>
      <head>
        {/* <script src="http://localhost:8097" async></script> */}
        <ColorSchemeScript defaultColorScheme={initialColorScheme} />
        <link rel="shortcut icon" href="/icon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
