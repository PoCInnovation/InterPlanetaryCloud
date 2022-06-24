import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import App from '../src/app/App';

import theme from '../src/theme';



export default function Document() {
  return (
    <Html>
		<Head>
		</Head>
      <body>
        <Main />
        <NextScript />
		<React.StrictMode>
			<ChakraProvider theme={theme} resetCSS>
				<App />
			</ChakraProvider>
		</React.StrictMode>
      </body>
    </Html>
  )
}
