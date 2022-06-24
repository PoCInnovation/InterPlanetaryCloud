import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import HomeView from '../src/views/HomeView';

import theme from '../src/theme';


import Head from 'next/head'

export default function Home() {
  return (
    <div>
	  <ChakraProvider theme={theme} resetCSS>
			<HomeView />
		</ChakraProvider>
    </div>
  )
}
