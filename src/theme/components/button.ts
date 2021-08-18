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
		outline: {
			_hover: {
				bg: 'white',
				opacity: '100%',
			},
			_before: {
				content: `''`,
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: -1,
				margin: -1,
				borderRadius: `${radius.base}`,
				bgGradient: `linear-gradient(90deg, ${colors.blue[700]} 0%, ${colors.red[700]} 100%)`,
			},
			bg: 'white',
			color: `${colors.blue[900]}`,
		},
	},
	defaultProps: {
		size: 'md',
		variant: 'gray',
	},
};

export default Button;
