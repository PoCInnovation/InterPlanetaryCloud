import { createContext, Dispatch, useContext } from 'react';
import { IPCConfig } from 'types/types';

type ConfigContextType = undefined | { configContext: IPCConfig; setConfig: Dispatch<IPCConfig | undefined> };

const ConfigContext = createContext<ConfigContextType>(undefined);

const useConfigContext = (): { configContext: IPCConfig; setConfig: Dispatch<IPCConfig | undefined> } => {
	const context = useContext(ConfigContext);
	if (!context) throw new Error('context used outside of provider.');
	return context;
};

export type { ConfigContextType };
export { useConfigContext };
export default ConfigContext;
