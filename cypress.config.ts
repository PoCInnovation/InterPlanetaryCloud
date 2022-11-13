import { defineConfig } from 'cypress';

export default defineConfig({
	watchForFileChanges: false,
	e2e: {
		baseUrl: 'http://localhost:8080',
	},
});
