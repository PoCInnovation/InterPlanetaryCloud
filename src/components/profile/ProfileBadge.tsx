import { HStack, Icon, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import Avatar from 'boring-avatars';
import { BiCopy } from 'react-icons/bi';

import colors from 'theme/foundations/colors';

type ProfileBadgeProps = {
	username: string;
	address: string;
};

const ProfileBadge = ({ username, address }: ProfileBadgeProps): JSX.Element => {
	const isDrawerNeeded: boolean = useBreakpointValue({ base: true, lg: false }) || false;

	const ProfileBadgeCard = (): JSX.Element => (
		<HStack
			bg="blue.50"
			borderRadius="12px"
			spacing="16px"
			p="8px 16px"
			border={`1px solid ${colors.blue['100']}`}
			cursor="pointer"
			role="group"
			w={isDrawerNeeded ? '100%' : 'auto'}
		>
			<Avatar
				size="32"
				name={address}
				variant="marble"
				colors={[colors.red['1000'], colors.blue['1100'], colors.red['500'], colors.gray['100'], colors.blue['500']]}
			/>
			<VStack spacing="0px" align="left">
				<Text
					size={isDrawerNeeded ? 'md' : 'lg'}
					maxW={{ base: '150px', md: '250px' }}
					overflow="hidden"
					textOverflow="ellipsis"
					whiteSpace="nowrap"
					_groupHover={{
						display: 'none',
					}}
				>
					{username}
				</Text>
				<HStack
					_groupHover={{
						display: 'flex',
					}}
					display="none"
				>
					<Icon as={BiCopy} w="16px" h="16px" color="blue.1100" />
					<Text
						size="md"
						maxW={{ base: '150px', md: '250px' }}
						overflow="hidden"
						textOverflow="ellipsis"
						whiteSpace="nowrap"
						onClick={() => navigator.clipboard.writeText(address)}
					>
						Copy address
					</Text>
				</HStack>
			</VStack>
		</HStack>
	);

	return <ProfileBadgeCard />;
};

export default ProfileBadge;
