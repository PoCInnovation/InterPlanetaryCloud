import Head from 'next/head';
import '../src/theme/index.css';

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
  				<title>InterPlanetaryCloud</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
