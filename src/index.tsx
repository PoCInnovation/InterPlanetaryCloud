import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/App';

import theme from './theme';
import './theme/index.css';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ChakraProvider theme={theme} resetCSS>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root'),
);
