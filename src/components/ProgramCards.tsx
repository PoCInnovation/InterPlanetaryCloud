import { Button } from '@chakra-ui/react';

import ProgramCard from 'components/ProgramCard';

import type { IPCProgram } from 'types/types';

import { RedeployButton } from 'components/CustomButtons';

type ProgramCardsProps = {
	programs: IPCProgram[];
	onOpenRedeployProgram: () => void;
	isRedeployLoading: boolean;
	setSelectedProgram: (program: IPCProgram) => void;
};

const ProgramCards = ({
	programs,
	onOpenRedeployProgram,
	isRedeployLoading,
	setSelectedProgram,
}: ProgramCardsProps): JSX.Element => (
	<>
		{programs.map((program: IPCProgram) => (
			<ProgramCard key={program.createdAt} program={program}>
				<>
					<Button
						as="a"
						href={`https://aleph.sh/vm/${program.hash}`}
						target="_blank"
						variant="inline"
						size="sm"
						w="45%"
						p="0px"
						id="ipc-computing-forwardUrl-button"
					>
						Go to site
					</Button>
					<RedeployButton
						onClick={() => {
							setSelectedProgram(program);
							onOpenRedeployProgram()
						}}
						isLoading={isRedeployLoading}
					/>
				</>
			</ProgramCard>
		))}
	</>
);

export default ProgramCards;
