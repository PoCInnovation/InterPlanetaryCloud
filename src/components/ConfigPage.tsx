import React, { useState } from 'react';
import { Text, HStack, Input } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

const ConfigPage = (): JSX.Element => {
	const { user } = useUserContext();

	const [editedConfig] = useState(user.config);

	return (
		<>
			<Text>InterPlanetaryCloud Configuration</Text>
			{Object.entries(editedConfig).map(([key, value]) => (
				<HStack key={key} w="25%">
					<Text>{key}:</Text>
					<Input placeholder="Aa" value={value} />
				</HStack>
			))}
		</>
	);
};

export default ConfigPage;
