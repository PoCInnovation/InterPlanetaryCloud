'use client';

import { VStack } from '@chakra-ui/react';

import FeaturesSection from 'components/landingPage/FeaturesSection';
import Footer from 'components/landingPage/Footer';
import HeadingSection from 'components/landingPage/HeadingSection';
import NavBar from 'components/landingPage/NavBar';
import PartnersSection from 'components/landingPage/PartnersSection';
import ServicesSection from 'components/landingPage/ServicesSection';

const Home = (): JSX.Element => (
	<VStack w="100%" spacing={{ base: '128px', lg: '256px' }} pt="64px" overflowY="hidden">
		<NavBar />
		<HeadingSection />
		<VStack w="100%" spacing={{ base: '96px', lg: '128px' }}>
			<PartnersSection />
			<ServicesSection />
			<FeaturesSection />
		</VStack>
		<Footer />
	</VStack>
);
export default Home;
