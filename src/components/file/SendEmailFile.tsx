import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Icon,
	Input,
	Text,
	Textarea,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { BiSend } from 'react-icons/bi';
import React, { useState } from 'react';
import { IPCFile } from '../../types/types';
import Button from '../Button';
import Modal from '../Modal';
import { textColorMode } from '../../config/colorMode';
import sendContactForm from '../../lib/email';
import { useUserContext } from '../../contexts/user';

type SendEmailFileProps = {
	file: IPCFile;
	onClosePopover: () => void;
};

type EmailElements = {
	email: string;
	subject: string;
	message: string;
	fileName: string;
	fileContent: string;
	userName: string;
}

const initValues: EmailElements = { email: '', subject: '', message: '', fileContent: '', fileName: '', userName: '' };


const initState = { isLoading: false, error: '', values: initValues };

const SendEmailFile = ({ file, onClosePopover }: SendEmailFileProps): JSX.Element => {
	const { user } = useUserContext();
	const isDrawer = useBreakpointValue({ base: true, sm: false }) || false;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { colorMode } = useColorMode();
	const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
	const [state, setState] = useState(initState);
	const toast = useToast({ duration: 2000, isClosable: true });
	const [touched, setTouched] = useState<{ email: boolean, subject: boolean, message: boolean }>({
		email: false,
		subject: false,
		message: false,
	});

	const { isLoading, error, values } = state;

	const arrayBufferToStringAndBase64 = async () => {
		const data = await user.drive.getContentFile(file);
		const uint8Array = new Uint8Array(data);

		const decoder = new TextDecoder('utf-8');
		return decoder.decode(uint8Array);
	};


	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const onBlur = async ({ target }) =>
		setTouched((prev) => ({ ...prev, [target.name]: true }));

	const sendEmail = async () => {
		setState((prev) => ({
			...prev,
			isLoading: true,
		}));
		try {
			values.fileContent = await arrayBufferToStringAndBase64();
			values.fileName = file.name;
			values.userName = user?.fullContact.contact.username;
			await sendContactForm(values);
			setTouched({ email: false, subject: false, message: false });
			setState(initState);
			toast({
				title: 'Message sent.',
				status: 'success',
				duration: 2000,
				position: 'top',
			});
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
		} catch (err: Error) {
			setState((prev) => ({
				...prev,
				isLoading: false,
				err: err.message,
			}));
		}
		if (values.email) {
			onClose();
			onClosePopover();
		}
	};

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const handleChange = ({ target }) =>
		setState((prev) => ({
			...prev,
			values: {
				...prev.values,
				[target.name]: target.value,
			},
		}));

	return (
		<HStack
			spacing={isDrawer ? '24px' : '12px'}
			p='8px 12px'
			borderRadius='8px'
			role='group'
			onClick={onOpen}
			w='100%'
			cursor='pointer'
			id='ipc-dashboard-rename-button'
			_hover={{
				bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
			}}
		>
			<Icon
				as={BiSend}
				_groupHover={{ color: 'red.800' }}
				w={isDrawer ? '24px' : '20px'}
				h={isDrawer ? '24px' : '20px'}
			/>
			<Text
				fontSize='16px'
				fontWeight='400'
				_groupHover={{
					color: 'red.800',
					fontWeight: '500',
				}}
				color={textColor}
			>
				Send with email
			</Text>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title='Send email'
				CTA={
					<Button
						variant='primary'
						size='lg'
						onClick={sendEmail}
						isLoading={isLoading}
						id='ipc-dashboard-update-filename-button'
						disabled={!values.email}
						// onClickCapture={sendEmail}
						onClickCapture={arrayBufferToStringAndBase64}
					>
						Send
					</Button>
				}
			>
				<>
					{error && (
						<Text color='red.300' my={4} fontSize='xl'>
							{error}
						</Text>
					)}
					<FormControl isRequired isInvalid={touched.email && !values.email}>
						<FormLabel color={textColor}>To</FormLabel>
						<Input
							type='email'
							w='100%'
							p='10px'
							name={'email'}
							value={values.email}
							placeholder={'email.ts@gmail.com'}
							onChange={handleChange}
							id='ipc-dashboard-input-update-filename'
							onBlur={onBlur}
						/>
						<FormErrorMessage>Required</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel color={textColor} mt='15px'>Subject</FormLabel>
						<Input
							name={'subject'}
							value={values.subject}
							type='text'
							w='100%'
							p='10px'
							placeholder={'Document to sign, ...'}
							onChange={handleChange}
							id='ipc-dashboard-input-update-filename'
							onBlur={onBlur}
						/>

					</FormControl>
					<FormControl>
						<FormLabel color={textColor} mt='15px'>Message</FormLabel>
						<Textarea
							name={'message'}
							value={values.message}
							w='100%'
							p='10px'
							id='ipc-dashboard-input-update-filename'
							typeof={'text'}
							rows={4}
							onChange={handleChange}
							onBlur={onBlur}
						/>
					</FormControl>
				</>
			</Modal>
		</HStack>
	);
};

export default SendEmailFile;
