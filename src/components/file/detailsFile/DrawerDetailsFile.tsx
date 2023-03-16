import {
	Box,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Stack,
	Text,
	useBreakpointValue,
	useColorMode,
} from '@chakra-ui/react';

import useToggle from 'hooks/useToggle';

import { useUserContext } from 'contexts/user';

import { IPCContact, IPCFile } from 'types/types';

import formatDate from 'utils/formatDate';
import formatFileSize from 'utils/formatFileSize';
import getFileType from 'utils/getFileType';

import colors from 'theme/foundations/colors';

const DrawerDetailsFile = ({
	file,
	isOpen,
	onClose,
}: {
	file: IPCFile;
	isOpen: boolean;
	onClose: () => void;
}): JSX.Element => {
	const { user } = useUserContext();
	const { toggle: showShared, toggleHandler: sharedHandler } = useToggle();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;

	const list: { name: string; address: string }[] = [];
	user.contact.contacts.forEach((contact: IPCContact) => {
		contact.files.forEach((contactFile: IPCFile) => {
			if (contactFile.hash === file.hash) {
				list.push({ name: contact.name, address: contact.address });
			}
		});
	});

	const {colorMode} = useColorMode();

	return (
		<Drawer onClose={onClose} isOpen={isOpen} size={'sm'} placement={isDrawer ? 'bottom' : 'right'}>
			<DrawerOverlay />
			<DrawerContent
				m={isDrawer ? '' : '16px'}
				borderRadius={isDrawer ? '16px' : '8px'}
				maxH={isDrawer ? '75%' : '100%'}
			>
				{!isDrawer && <DrawerCloseButton />}
				<DrawerBody p={isDrawer ? '32px 16px 64px 16px' : '32px 16px 16px 16px'}>
					<Stack spacing="32px">
						<Stack px="16px">
							<Text color={colorMode} size="lg"> {file.name} </Text>
							<Box
								w="100%"
								h="3px"
								bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 40%)`}
								borderRadius="16px"
							/>
						</Stack>
						<Stack px="16px">
							<Text color={colorMode}>
								<Box as="span" fontWeight="500">
									Created at{' '}
								</Box>
								{formatDate(file.createdAt)}
							</Text>
							<Text color={colorMode}>
								<Box as="span" fontWeight="500">
									Size of:
								</Box>{' '}
								{formatFileSize(file.size)}
							</Text>
							<Text color={colorMode}>
								<Box as="span" fontWeight="500">
									IPFS hash:
								</Box>{' '}
								{file.hash}
							</Text>
							<Text color={colorMode}>
								<Box as="span" fontWeight="500">
									Type:
								</Box>{' '}
								{getFileType(file.name)}
							</Text>
						</Stack>
						<Stack spacing="16px">
							<Stack onClick={sharedHandler} bg="blue.50" p="12px 16px" w="100%" borderRadius="8px" cursor="pointer">
								<Text>
									<Box as="span" fontWeight="500">
										This file is shared with:
									</Box>
									<Box
										as="span"
										bgClip="text"
										bgGradient={`linear-gradient(90deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`}
										fontWeight="600"
									>
										{` ${list.length} ${list.length > 1 ? 'contacts' : 'contact'}`}
									</Box>
								</Text>
								{showShared ? (
									list.map((item) => (
										<Stack spacing="0px" w="100%" px="8px" py="4px" bg="white" borderRadius="8px">
											<Text size="lg">{item.name}</Text>
											<Text size="sm">{item.address}</Text>
										</Stack>
									))
								) : (
									<></>
								)}
							</Stack>
						</Stack>
						<Stack px="16px">
							<Box
								w="100%"
								h="3px"
								bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 40%)`}
								borderRadius="16px"
							/>
							<Text color={colorMode} size="lg">History: </Text>
							{file.logs.map((log) => (
								<HStack w="100%" justify="space-between" key={log.date}>
									<Text color={colorMode}>{log.action}</Text>
									<Text color={colorMode}>{formatDate(log.date)}</Text>
								</HStack>
							))}
						</Stack>
					</Stack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerDetailsFile;
