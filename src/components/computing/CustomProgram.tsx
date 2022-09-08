import { ChangeEvent } from 'react';
import { Input } from '@chakra-ui/react';

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
	<>
		<Input
			placeholder="[Optional] Program name"
			value={customName}
			onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)}
		/>
		<Input
			placeholder="[Optional] Program entrypoint"
			value={customEntrypoint}
			onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomEntrypoint(e.target.value)}
		/>
	</>
);

export default CustomProgram;
