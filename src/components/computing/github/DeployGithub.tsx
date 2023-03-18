import {
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useDisclosure,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineGithub } from 'react-icons/ai';

import { textColorMode } from 'config/colorMode';

import GithubModal from './GithubModal';

const DeployGithub = (): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const { colorMode } = useColorMode();

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-deploy-github-program-button"
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={AiOutlineGithub}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize="16px"
				fontWeight="400"
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={textColor}
			>
				Deploy from Github
			</Text>
			<GithubModal isOpen={isOpen} onClose={onClose} />
		</HStack>
	);
};

export default DeployGithub;
