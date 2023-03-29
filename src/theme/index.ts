import { extendTheme } from '@chakra-ui/react';

// Foundation overrides
import radius from 'theme/foundations/borderRadius';
import colors from 'theme/foundations/colors';
import fonts from 'theme/foundations/fonts';
import shadows from 'theme/foundations/shadows';

import Button from 'theme/components/button';
import Link from 'theme/components/link';
import Text from 'theme/components/text';

const breakpoints = {
	xs: '320px',
	sm: '576px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1440px',
	'3xl': '1600px',
	'4xl': '1920px',
	'5xl': '2560px',
};

const overrides = {
	shadows,
	fonts,
	radius,
	colors,
	breakpoints,
	components: {
		Button,
		Link,
		Text,
	},
};

export default extendTheme(overrides, breakpoints);
