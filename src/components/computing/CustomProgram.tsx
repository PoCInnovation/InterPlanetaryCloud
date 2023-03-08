import { Input, Text, VStack } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

type CustomProgramParams = {
	customName: string;
	setCustomName: (name: string) => void;
	customEntrypoint: string;
	setCustomEntrypoint: (entrypoint: string) => void;
};

const CustomProgram = ({
	customName,
	setCustomName,
	customEntrypoint,
	setCustomEntrypoint,
}: CustomProgramParams): JSX.Element => (
	<VStack spacing="16px" w="100%">
		<VStack spacing="8px" align="start" w="100%">
			<Text size="boldLg">The name of the program</Text>
			<Input value={customName} onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)} />
		</VStack>
		<VStack spacing="8px" align="start" w="100%">
			<Text size="boldLg">The entrypoint of the program</Text>
			<Input
				value={customEntrypoint}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomEntrypoint(e.target.value)}
			/>
		</VStack>
	</VStack>
);

export default CustomProgram;
