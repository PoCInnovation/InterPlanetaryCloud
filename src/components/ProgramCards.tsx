import { Button } from '@chakra-ui/react';
import ProgramCard from './ProgramCard';
import type { IPCProgram } from '../types/types';

type ProgramCardsProps = {
	programs: IPCProgram[];
};

export const ProgramCards = ({ programs }: ProgramCardsProps): JSX.Element => (
	<>
		{programs.map((program: IPCProgram) => (
			<ProgramCard key={program.created_at} program={program}>
				<>
					<Button
						as="a"
						href={`https://aleph.sh/vm/${program.hash}`}
						target="_blank"
						variant="inline"
						size="sm"
						w="100%"
						p="0px"
						id="ipc-computingView-forwardUrl-button"
					>
						Go to site
					</Button>
				</>
			</ProgramCard>
		))}
	</>
);
