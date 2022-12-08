import {
	Box,
	DrawerHeader,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerBody,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	CloseButton,
	useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import React, { useState } from 'react';
import colors from 'theme/foundations/colors';
import { IPCFile, FileLogs } from 'types/types';
import { useUserContext } from 'contexts/user';
import type { IPCContact } from 'types/types';

const DetailsFile = ({ file }: { file: IPCFile }): JSX.Element => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const { user } = useUserContext();
	const [showShared, setShow] = useState(false);
	const toggleFct = () => {
		setShow(!showShared);
	};

	const list: { name: string }[] = [];
	user.contact.contacts.forEach((contact: IPCContact) => {
		contact.files.forEach((contactFile: IPCFile) => {
			if (contactFile.hash === file.hash) {
				list.push({ name: contact.name });
			}
		});
	});

	const listLogs: { actionLogs: string; dateLogs: number }[] = [];
	file.logs.forEach((action: FileLogs) => {
		listLogs.push({ actionLogs: action.action, dateLogs: action.date });
	});

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p="8px 12px"
			borderRadius="8px"
			role="group"
			onClick={onOpen}
			w="100%"
			cursor="pointer"
			id="ipc-dashboard-details-button"
			_hover={{
				bg: 'blue.100',
			}}
		>
			<Icon
				as={AiOutlineInfoCircle}
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
			>
				Détail
			</Text>
			<Drawer onClose={onClose} isOpen={isOpen} size={'sm'}>
				<DrawerOverlay />
				<DrawerContent>
					<HStack>
						<DrawerHeader fontSize={'20px'}> {file.name} </DrawerHeader>
						<Box display="flex" alignSelf={'right'}>
							<CloseButton size="lg" />
						</Box>
					</HStack>
					<Box
						display="flex"
						mt="2"
						alignSelf={'center'}
						margin="-7px 0px 25px 0px"
						w={{ base: '400px' }}
						h="5px"
						bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 40%)`}
						borderRadius="16px"
					/>
					<DrawerBody>
						<Text fontSize="l">
							Create at Nov.{' '}
							{`${new Date(file.createdAt).toString().substring(4, 15).slice(0, 3)}
						/${new Date(file.createdAt).toString().substring(4, 15).slice(3, 6)}
						/${new Date(file.createdAt).toString().substring(4, 15).slice(6)}`}
						</Text>

						<br />
						<Text fontSize="l" marginBottom="10px">
							{' '}
							Size of : <b>{file.size / 1000}ko</b>
						</Text>
						<Text fontSize="l" marginBottom="10px">
							{' '}
							Hash of ipfs: <b>{file.hash}</b>
						</Text>
						<Text fontSize="l" marginBottom="10px">
							{' '}
							Type : PDF file{' '}
						</Text>
						<br />
						<HStack onClick={toggleFct}>
							<Box
								display="flex"
								alignItems="baseline"
								backgroundColor={colors.blue[100]}
								borderRadius="6px"
								padding={'10px 10px 10px 10px'}
							>
								<Text fontSize={{ base: '16px', sm: '17px' }}>
									This file is shared with:
									<Box
										as="span"
										bgClip="text"
										bgGradient={`linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`}
									>
										{' '}
										4 people
									</Box>{' '}
								</Text>
							</Box>
						</HStack>
						{showShared ? list.map((item) => <Text>{item.name}</Text>) : null}
						<br />
						<Box
							display="flex"
							mt="2"
							alignSelf={'center'}
							margin="-7px 0px 25px 0px"
							w={{ base: '400px' }}
							h="5px"
							bg={`linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 40%)`}
							borderRadius="16px"
						/>
						<Text fontSize="l"> History : </Text>
						<br />
						{listLogs.map((item) => (
						<Text fontSize="l"> {item.actionLogs} {`${new Date(item.dateLogs).toString().substring(4, 15).slice(0, 3)}
																									/${new Date(item.dateLogs).toString().substring(4, 15).slice(3, 6)}
																									/${new Date(item.dateLogs).toString().substring(4, 15).slice(6)}`} </Text>))}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</HStack>
	);
};

export default DetailsFile;
