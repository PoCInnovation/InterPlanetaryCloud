describe('Good front for Connection', () => {
	it('Go to connection', () => {
		cy.visit('/connection');
	});

	it('Good title', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
	});

	it('Good sub title', () => {
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 2);
	});

	it('Good name for create account button', () => {
		cy.get('#ipc-home-create-account-button').should('contain', 'Create an account');
	});

	it('Good name for login button', () => {
		cy.get('#ipc-home-login-button').should('contain', 'Login');
	});
});

describe('Signup Button front in Connection', () => {
	it('Go to connection', () => {
		cy.visit('/connection');
	});

	it('Good URL redirect for create account button', () => {
		cy.get('#ipc-home-create-account-button').click().url().should('eq', `${Cypress.config().baseUrl}/signup`);
	});
});

describe('Login Button front in Connection', () => {
	it('Go to connection', () => {
		cy.visit('/connection');
	});

	it('Good URL redirect for login button', () => {
		cy.get('#ipc-home-login-button').click().url().should('eq', `${Cypress.config().baseUrl}/login`);
	});
});
