import React from 'react';

// TODO: update this component with chakra -> better UX
const FullPageLoader: React.FC = () => (
	<div className="absolute w-screen h-screen bg-white flex items-center justify-center">
		<p className="text-lg text-gray-600">Loading...</p>
	</div>
);

export default FullPageLoader;
