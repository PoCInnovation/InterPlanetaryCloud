import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

// Foundations overrides
import fonts from './foundations/fonts';
import colors from './foundations/colors';
import radius from './foundations/borderRadius';
import shadows from './foundations/shadows';

import Button from './components/button';
import Link from './components/link';
import Text from './components/text';

const breakpoints = createBreakpoints({
	'3xs': '192px',
	'2xs': '256px',
	xs: '320px',
	'3sm': '408px',
	'2sm': '480px',
	sm: '576px',
	'2md': '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1440px',
});

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

export default extendTheme(overrides);
