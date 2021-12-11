describe('testing home ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
		cy.wait(1000);
	});

	it('Good front', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
		cy.get('button').should('have.length', 2);
		cy.get('#ipc-homeView-create-account-button').should('contain', 'Create an account');
		cy.get('#ipc-homeView-login-button').should('contain', 'Login');
	});

	it('Create Account Button', () => {
		cy.get('#ipc-homeView-create-account-button').click().url().should('eq', 'http://localhost:3000/signup');
	});

	it('Login Button', () => {
		cy.get('#ipc-homeView-login-button').click().url().should('eq', 'http://localhost:3000/login');
	});
});
