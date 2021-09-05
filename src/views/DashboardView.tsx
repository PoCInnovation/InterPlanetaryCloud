import React from 'react';
import { Box, VStack, Input, Button } from '@chakra-ui/react';

import { useUserContext } from 'contexts/user';

function extractFilename(filepath: string) {
	const result = /[^\\]*$/.exec(filepath);
	return result && result.length ? result[0] : '';
}

function getFileContent(file: unknown): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onload = (event: unknown) => {
			// eslint-disable-next-line
			resolve((event as any).target.result);
		};
		reader.onerror = (event) => {
			reject(event);
		};
		reader.readAsText(file as Blob);
	});
}

const Dashboard = (): JSX.Element => {
	const [fileEvent, setFileEvent] = React.useState<React.ChangeEvent<HTMLInputElement> | null>(null);
	const { user } = useUserContext();

	React.useEffect(() => {
		user.drive.load();
	}, []);

	const uploadFile = async () => {
		if (!fileEvent) return;
		const filename = extractFilename(fileEvent.target.value);
		const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);
		if (filename === '' || fileContent === '') return;
		await user.drive.upload({
			name: filename,
			content: fileContent,
			created_at: Date.now(),
		});
	};

	return (
		<Box marginTop="150px">
			<Box w="200px" marginBottom="64px">
				<Input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileEvent(e)} />
				<Button colorScheme="blue" color="white" background="blue" onClick={uploadFile}>
					Upload file
				</Button>
			</Box>
			<VStack
				style={{
					width: '900px',
				}}
			>
				{user.drive.files.map((file) => (
					<div
						key={file.created_at}
						style={{
							padding: '16px',
							background: 'white',
							width: '100%',
							boxShadow: '0px 2px 3px 3px rgb(240, 240, 240)',
							borderRadius: '4px',
							border: '1px solid rgb(200, 200, 200)',
							marginBottom: '8px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						{file.name}
						<Button
							onClick={async () => {
								await user.drive.download(file);
							}}
						>
							Download
						</Button>
					</div>
				))}
			</VStack>
		</Box>
	);
};

export default Dashboard;
