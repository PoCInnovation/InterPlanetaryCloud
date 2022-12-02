import { Box, Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import type { IPCProgram } from 'types/types';

import { RedeployButton } from 'components/computing/CustomButtons';
import ProgramCard from 'components/ProgramCard';
import { FcRules } from 'react-icons/fc';
import { useDriveContext } from '../contexts/drive';

type ProgramCardsProps = {
	onOpenRedeployProgram: () => void;
	isRedeployLoading: boolean;
	setSelectedProgram: (program: IPCProgram) => void;
};

const ChoseColor = () => {
	const colorText = useColorModeValue('gray.800', 'white');
	return colorText;
};

const ProgramCards = ({
	onOpenRedeployProgram,
	isRedeployLoading,
	setSelectedProgram,
}: ProgramCardsProps): JSX.Element => {
	const { programs } = useDriveContext();

	return (
		<>
			{programs.map((program: IPCProgram) => (
				<ProgramCard key={program.createdAt} program={program}>
					<>
						<Box w="25%">
							<HStack>
								<FcRules display="flex" size="40"></FcRules>
								<Text textColor={ChoseColor()}>{program.name}</Text>
							</HStack>
						</Box>
						<Box w="45%">
							<Button
								as="a"
								href={`https://aleph.sh/vm/${program.hash}`}
								target="_blank"
								variant="inline"
								size="sm"
								w="45%"
								p="0px"
								id="ipc-computing-forwardUrl-button"
								marginRight="10"
							>
								Go to site
							</Button>
							<RedeployButton
								onClick={() => {
									setSelectedProgram(program);
									onOpenRedeployProgram();
								}}
								isLoading={isRedeployLoading}
							/>
						</Box>
						<Text textColor={ChoseColor()}>
							{`${new Date(program.createdAt).toString().substring(4, 15).slice(0, 3)} /${new Date(program.createdAt)
								.toString()
								.substring(4, 15)
								.slice(3, 6)} /${new Date(program.createdAt).toString().substring(4, 15).slice(6)}`}
						</Text>
					</>
				</ProgramCard>
			))}
		</>
	);
};

export default ProgramCards;
