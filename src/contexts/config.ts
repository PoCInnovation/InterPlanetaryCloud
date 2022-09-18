import { createContext, Dispatch, useContext } from 'react';
import { IPCConfig } from 'types/types';

type ConfigContextType = undefined | { config: IPCConfig; setConfig: Dispatch<IPCConfig | undefined> };

const config = createContext<ConfigContextType>(undefined);

const useConfigContext = (): { config: IPCConfig; setConfig: Dispatch<IPCConfig | undefined> } => {
	const context = useContext(config);
	if (!context) throw new Error('context used outside of provider.');
	return context;
};

export type { ConfigContextType };
export { useConfigContext };
export default config;
