import colors from '../foundations/colors';
import radius from '../foundations/borderRadius';

const Button = {
	baseStyle: {
		borderRadius: `${radius.base}`,
		fontWeight: 500,
		fontSize: '16px',
		lineHeight: '24px',
		color: `${colors.blue[300]}`,
		_hover: {
			opacity: '90%',
		},
		_focus: {
			border: '0px solid rgba(0, 0, 0, 0)',
			boxShadow: `0px 0px 0px 2px ${colors.blue[700]}`,
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
		},
	},
	variants: {
		primary: {
			background: `${colors.blue[700]}`,
		},
	},
	defaultProps: {
		size: 'md',
		variant: 'primary',
	},
};

export default Button;
