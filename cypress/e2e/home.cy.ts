describe('Good front for HomeView', () => {
	it('Go to home view', () => {
		cy.visit('');
		cy.wait(1000);
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
		cy.get('#ipc-homeView-create-account-button').should('contain', 'Create an account');
	});

	it('Good name for login button', () => {
		cy.get('#ipc-homeView-login-button').should('contain', 'Login');
	});
});

describe('Create Account Button for HomeView', () => {
	it('Go to home view', () => {
		cy.visit('');
		cy.wait(1000);
	});

	it('Good URL redirect for create account button', () => {
		cy.get('#ipc-homeView-create-account-button').click().url().should('eq', 'http://localhost:8080/signup');
	});
});

describe('Login Button form HomeView', () => {
	it('Go to home view', () => {
		cy.visit('');
		cy.wait(1000);
	});

	it('Good URL redirect for login button', () => {
		cy.get('#ipc-homeView-login-button').click().url().should('eq', 'http://localhost:8080/login');
	});
});
