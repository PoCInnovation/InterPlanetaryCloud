describe('testing signup ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/signup');
		cy.wait(1000);
	});

	it('Good front', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
		cy.get('button').should('have.length', 2);
		cy.get('#ipc-signupView-credentials-signup-button').should('contain', 'Signup with credentials');
		cy.get('#ipc-signupView-login-button').should('contain', 'Login');
	});

	it('Good Modal front', () => {
		cy.get('#ipc-signupView-credentials-signup-button').click();
		cy.get('header').should('contain', 'Your Mnemonics');
		cy.get('button').should('have.length', 4);
		cy.get('textarea').should('have.length', 1);
		cy.get('#ipc-signupView-copy-mnemonics-button').should('contain', 'Copy my mnemonics');
		cy.get('#ipc-modal-close-button').should('contain', 'Close');
	});

	it('Signup with credentials Button', () => {
		cy.get('#ipc-signupView-credentials-signup-button').click();
		cy.get('#ipc-signupView-copy-mnemonics-button').click();
		//cy.get('#ipc-signupView-text-area').invoke('val').should('eq', clipboard.readSync());
		cy.get('#ipc-modal-close-button').click().url().should('eq', 'http://localhost:3000/dashboard');
	});

	it('Login Button', () => {
		cy.get('#ipc-signupView-login-button').click().url().should('eq', 'http://localhost:3000/login');
	});
});