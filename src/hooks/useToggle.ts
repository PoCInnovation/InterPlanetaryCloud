import { useState } from 'react';

const useToggle = () => {
	const [toggle, setToggle] = useState(false);
	const toggleHandler = () => setToggle(!toggle);
	return { toggle, toggleHandler };
};

export default useToggle;
