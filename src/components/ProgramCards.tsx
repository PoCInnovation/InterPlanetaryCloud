import { Button } from '@chakra-ui/react';

import ProgramCard from 'components/ProgramCard';

import type { IPCProgram } from 'types/types';

type ProgramCardsProps = {
	programs: IPCProgram[];
};

const ProgramCards = ({ programs }: ProgramCardsProps): JSX.Element => (
	<>
		{programs.map((program: IPCProgram) => (
			<ProgramCard key={program.createdAt} program={program}>
				<Button
					as="a"
					href={`https://aleph.sh/vm/${program.hash}`}
					target="_blank"
					variant="inline"
					size="sm"
					w="100%"
					p="0px"
					id="ipc-computing-forwardUrl-button"
				>
					Go to site
				</Button>
			</ProgramCard>
		))}
	</>
);

export default ProgramCards;
