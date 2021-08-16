import { Link as RouteLink } from 'react-router-dom';
import { Button, Link, Text, VStack } from '@chakra-ui/react';

const HomeView = (): JSX.Element => (
	<VStack spacing="80px" mt="132px">
		<VStack>
			<Text color="brown.500" fontSize="24px">
				Welcome to
			</Text>
			<Text color="brown.500" fontSize="64px" fontWeight="extrabold">
				Inter Planetary Cloud
			</Text>
			<Text color="brown.500">The first cloud unsealing your data</Text>
		</VStack>
		<VStack mt="3000px" w="496px">
			<Link as={RouteLink} to="/signup" w="100%">
				<Button color="brown.100" bg="brown.900" size="md" w="100%">
					Create an account
				</Button>
			</Link>
			<Link as={RouteLink} to="/login" w="100%">
				<Button color="brown.900" bg="brown.100" size="sm" w="100%">
					Login
				</Button>
			</Link>
		</VStack>
	</VStack>
);

export default HomeView;
