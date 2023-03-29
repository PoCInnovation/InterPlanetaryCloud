import radius from 'theme/foundations/borderRadius';
import colors from 'theme/foundations/colors';

const Button = {
	baseStyle: {
		borderRadius: `${radius.base}`,
		fontWeight: 500,
		fontSize: '16px',
		lineHeight: '24px',
	},
	sizes: {
		sm: {
			padding: '4px 16px',
			height: 'auto',
			fontSize: '12px',
			fontWeight: 700,
			borderRadius: '8px',
		},
		md: {
			padding: '6px 20px',
			height: 'auto',
			fontSize: '16px',
			fontWeight: 700,
			borderRadius: '8px',
		},
		lg: {
			padding: '8px 20px',
			height: 'auto',
			fontSize: '20px',
			fontWeight: 700,
			borderRadius: '8px',
		},
		xl: {
			padding: '8px 24px',
			height: 'auto',
			fontSize: '24px',
			fontWeight: 700,
			borderRadius: '12px',
		},
		'2xl': {
			padding: '12px 24px',
			height: 'auto',
			fontSize: '28px',
			fontWeight: 700,
			borderRadius: '12px',
		},
		'3xl': {
			padding: '16px 42px',
			height: 'auto',
			fontSize: '32px',
			fontWeight: 700,
			borderRadius: '12px',
		},
	},
	variants: {
		primary: {
			backgroundImage: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 50%, ${colors.blue[900]} 100%)`,
			color: 'blue.100',
			bgClip: 'text',
			backgroundSize: '200% 100%',

			mozTransition: 'all .6s ease-in-out',
			oTransition: 'all .6s ease-in-out',
			webkitTransition: 'all .6s ease-in-out',
			transition: 'all .6s ease-in-out',
			_hover: {
				_disabled: {
					backgroundImage: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 50%, ${colors.blue[900]} 100%)`,
					backgroundSize: '200% 100%',
					color: 'blue.100',
					bgClip: 'text',
				},
				color: 'blue.100',
				background: 'blue.1100',

				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			},
		},
		secondary: {
			background: 'blue.100',
			color: 'blue.1100',

			mozTransition: 'all .6s ease-in-out',
			oTransition: 'all .6s ease-in-out',
			webkitTransition: 'all .6s ease-in-out',
			transition: 'all .6s ease-in-out',
			_disabled: {
				opacity: 0.5,
			},
			_hover: {
				_disabled: {
					background: 'blue.100',
					color: 'blue.1100',
				},
				color: 'blue.100',
				background: 'blue.1100',

				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			},
		},
		special: {
			backgroundImage: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 50%, ${colors.blue[900]} 100%)`,
			color: 'blue.100',
			backgroundSize: '200% 100%',

			mozTransition: 'all .6s ease-in-out',
			oTransition: 'all .6s ease-in-out',
			webkitTransition: 'all .6s ease-in-out',
			transition: 'all .6s ease-in-out',

			_disabled: {
				opacity: 0.5,
			},

			_hover: {
				_disabled: {
					backgroundImage: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 50%, ${colors.blue[900]} 100%)`,
					color: 'blue.100',
					backgroundSize: '200% 100%',
				},
				backgroundPosition: '100% 0',

				mozTransition: 'all .6s ease-in-out',
				oTransition: 'all .6s ease-in-out',
				webkitTransition: 'all .6s ease-in-out',
				transition: 'all .6s ease-in-out',
			},
		},
	},
	defaultProps: {
		size: 'md',
		variant: 'secondary',
	},
};

export default Button;
