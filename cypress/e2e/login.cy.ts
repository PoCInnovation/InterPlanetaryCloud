const mnemonic = 'enlist deny plug hockey sign dirt rebel nothing tobacco dream error fever';

describe('Good front for Login', () => {
	it('Go to login', () => {
		cy.visit('/login');
	});

	it('Good title', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
	});

	it('Good sub title', () => {
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
	});

	it('Good number of text-area', () => {
		cy.get('#ipc-login-text-area').should('have.length', 1);
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 2);
	});

	it('Good name for login with credentials button', () => {
		cy.get('#ipc-login-credentials-button').should('contain', 'Login with credentials');
	});

	it('Good name for signup button', () => {
		cy.get('#ipc-login-signup-button').should('contain', 'Signup');
	});
});

describe('Login with credentials Button for Login', () => {
	it('Go to login', () => {
		cy.visit('/login');
		cy.get('#ipc-login-text-area').click().type(mnemonic);
	});

	it('Good mnemonic into text area', () => {
		cy.get('#ipc-login-text-area').invoke('val').should('eq', mnemonic);
	});

	it('Good URL redirect for login button', () => {
		cy.get('#ipc-login-credentials-button').click().url().should('eq', `${Cypress.config().baseUrl}/dashboard`);
	});
});

describe('Signup Button for Login', () => {
	it('Go to login', () => {
		cy.visit('/login');
	});

	it('Good URL redirect for signup button', () => {
		cy.get('#ipc-login-signup-button').click().url().should('eq', `${Cypress.config().baseUrl}/signup`);
	});
});
