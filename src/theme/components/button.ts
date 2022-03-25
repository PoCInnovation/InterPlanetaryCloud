import colors from '../foundations/colors';
import radius from '../foundations/borderRadius';

const Button = {
	baseStyle: {
		borderRadius: `${radius.base}`,
		fontWeight: 500,
		fontSize: '16px',
		lineHeight: '24px',
		_hover: {
			opacity: '90%',
		},
	},
	sizes: {
		sm: {
			padding: '8px 16px',
			height: '44px',
			fontSize: '12px',
		},
		md: {
			padding: '16px 32px',
			height: '56px',
			fontSize: '16px',
		},
	},
	variants: {
		gray: {
			background: `${colors.gray[300]}`,
			color: `${colors.gray[700]}`,
		},
		inline: {
			bgGradient: `linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`,
			color: 'white',
		},
		reverseInline: {
			bgGradient: `linear-gradient(90deg, ${colors.red[700]} 0%, ${colors.blue[700]} 100%)`,
			color: 'white',
		},
	},
	defaultProps: {
		size: 'md',
		variant: 'gray',
	},
};

export default Button;
