import { VStack } from '@chakra-ui/react';

import NavBar from 'components/landingPage/NavBar';
import HeadingSection from 'components/landingPage/HeadingSection';
import PartnersSection from 'components/landingPage/PartnersSection';
import ServicesSection from 'components/landingPage/ServicesSection';
import FeaturesSection from 'components/landingPage/FeaturesSection';
import Footer from 'components/landingPage/Footer';

const Home = (): JSX.Element => (
	<VStack w="100%" spacing="256px" pt="64px" overflowY="hidden">
		<NavBar />
		<HeadingSection />
		<VStack w="100%" spacing="128px">
			<PartnersSection />
			<ServicesSection />
			<FeaturesSection />
		</VStack>
		<Footer />
	</VStack>
);

export default Home;
