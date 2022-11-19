import colors from 'theme/foundations/colors';

const Text = {
	baseStyle: {
		color: 'blue.1100',
		fontFamily: 'Poppins',
	},
	sizes: {
		sm: {
			fontSize: '12px',
			fontWeight: 400,
		},
		boldSm: {
			fontSize: '12px',
			fontWeight: 700,
		},
		md: {
			fontSize: '14px',
			fontWeight: 400,
		},
		boldMd: {
			fontSize: '14px',
			fontWeight: 700,
		},
		lg: {
			fontSize: '16px',
			fontWeight: 500,
		},
		boldLg: {
			fontSize: '16px',
			fontWeight: 700,
		},
		xl: {
			fontSize: '20px',
			fontWeight: 600,
		},
		boldXl: {
			fontSize: '20px',
			fontWeight: 700,
		},
		'2xl': {
			fontSize: '24px',
			fontWeight: 700,
		},
		'3xl': {
			fontSize: '32px',
			fontWeight: 700,
		},
		'4xl': {
			fontSize: '36px',
			fontWeight: 700,
		},
		'5xl': {
			fontSize: '42px',
			fontWeight: 700,
		},
		'6xl': {
			fontSize: '48px',
			fontWeight: 700,
		},
		'7xl': {
			fontSize: '64px',
			fontWeight: 700,
		},
	},
	variants: {
		bold: {
			fontWeight: 700,
		},
		gradient: {
			backgroundImage: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.red[900]} 100%)`,
			bgClip: 'text',
		},
		reverseGradient: {
			backgroundImage: `linear-gradient(135deg, ${colors.red[900]} 0%, ${colors.blue[900]} 100%)`,
			bgClip: 'text',
		},
	},
	defaultProps: {
		size: 'md',
	},
};

export default Text;
