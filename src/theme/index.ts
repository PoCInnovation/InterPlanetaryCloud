import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

// Foundation overrides
import fonts from 'theme/foundations/fonts';
import colors from 'theme/foundations/colors';
import radius from 'theme/foundations/borderRadius';
import shadows from 'theme/foundations/shadows';

import Button from 'theme/components/button';
import Link from 'theme/components/link';
import Text from 'theme/components/text';

const breakpoints = createBreakpoints({
	xs: '320px',
	sm: '576px',
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
