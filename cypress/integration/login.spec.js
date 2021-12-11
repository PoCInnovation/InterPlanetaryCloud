const mnemonic = 'repair nest celery light distance coil giant pyramid poet suit trim fluid';

describe('testing login ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/login');
		cy.wait(1000);
	});

	it('Good front', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
		cy.get('#ipc-loginView-text-area').should('have.length', 1);
		cy.get('button').should('have.length', 2);
		cy.get('#ipc-loginView-credentials-button').should('contain', 'Login with credentials');
		cy.get('#ipc-loginView-signup-button').should('contain', 'Signup');
	});

	it('Login with credentials Button', () => {
		cy.get('#ipc-loginView-text-area').click().type(mnemonic);
		cy.get('#ipc-loginView-text-area').invoke('val').should('eq', mnemonic);
		cy.get('#ipc-loginView-credentials-button').click().url().should('eq', 'http://localhost:3000/dashboard');
	});

	it('Signup Button', () => {
		cy.get('#ipc-loginView-signup-button').click().url().should('eq', 'http://localhost:3000/signup');
	});
});
