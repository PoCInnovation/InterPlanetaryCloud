import { IconType } from 'react-icons';

import { Button as ChakraButton, ButtonProps, Icon, useTheme, VStack } from '@chakra-ui/react';

type CustomButtonProps = {
	buttonType?: 'no-icon' | 'left-icon' | 'right-icon';
	icon?: IconType;
};

const LeftIconButton = ({ children, icon, ...props }: ButtonProps & { icon: IconType }): JSX.Element => {
	const theme = useTheme();

	return props.variant === 'primary' ? (
		<VStack
			bg="blue.100"
			_hover={{
				/* eslint-disable-next-line no-underscore-dangle */
				bg: theme.components.Button.variants[props.variant || 'secondary']._hover.background,
			}}
			borderRadius={theme.components.Button.sizes[(props.size as string) || 'md'].borderRadius}
			cursor="pointer"
			justify="space-between"
			sx={{
				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			}}
			w={props.w}
		>
			<ChakraButton {...props} role="group">
				<Icon
					as={icon}
					mr="8px"
					color="blue.1000"
					_groupHover={{
						color: 'blue.100',
					}}
				/>
				{children}
			</ChakraButton>
		</VStack>
	) : (
		<ChakraButton {...props}>
			<Icon as={icon} mr="8px" color={props.color} />
			{children}
		</ChakraButton>
	);
};

const RightIconButton = ({ children, icon, ...props }: ButtonProps & { icon: IconType }): JSX.Element => {
	const theme = useTheme();

	return props.variant === 'primary' ? (
		<VStack
			bg="blue.100"
			_hover={{
				/* eslint-disable-next-line no-underscore-dangle */
				bg: theme.components.Button.variants[props.variant || 'secondary']._hover.background,
			}}
			borderRadius={theme.components.Button.sizes[(props.size as string) || 'md'].borderRadius}
			sx={{
				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			}}
			w={props.w}
		>
			<ChakraButton {...props} role="group">
				{children}
				<Icon
					as={icon}
					ml="8px"
					color="red.1000"
					_groupHover={{
						color: 'blue.100',
						_disabled: {
							color: 'blue.100',
						},
					}}
				/>
			</ChakraButton>
		</VStack>
	) : (
		<ChakraButton {...props}>
			{children}
			<Icon as={icon} ml="8px" color={props.color} />
		</ChakraButton>
	);
};

const NoIconButton = ({ children, ...props }: ButtonProps): JSX.Element => {
	const theme = useTheme();

	return props.variant === 'primary' ? (
		<VStack
			bg="blue.100"
			_hover={{
				/* eslint-disable-next-line no-underscore-dangle */
				bg: theme.components.Button.variants[props.variant || 'secondary']._hover.background,
			}}
			borderRadius={theme.components.Button.sizes[(props.size as string) || 'md'].borderRadius}
			sx={{
				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			}}
			w={props.w}
		>
			<ChakraButton {...props}>{children}</ChakraButton>
		</VStack>
	) : (
		<ChakraButton {...props}>{children}</ChakraButton>
	);
};

const Button = ({ children, buttonType = 'no-icon', icon, ...props }: CustomButtonProps & ButtonProps): JSX.Element => {
	if (buttonType === 'no-icon' || !icon) {
		return <NoIconButton {...props}>{children}</NoIconButton>;
	}
	if (buttonType === 'left-icon') {
		return (
			<LeftIconButton icon={icon} {...props}>
				{children}
			</LeftIconButton>
		);
	}
	return (
		<RightIconButton icon={icon} {...props}>
			{children}
		</RightIconButton>
	);
};

export default Button;
