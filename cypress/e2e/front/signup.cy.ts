describe('Good front for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
	});

	it('Good title', () => {
		cy.get('#ipc-title').should('contain', 'Inter Planetary Cloud');
	});

	it('Good sub title', () => {
		cy.get('#ipc-sub-title').should('contain', 'The first cloud unsealing your data');
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 3);
	});

	it('Good name for signup credentials button', () => {
		cy.get('#ipc-signup-create-copy-mnemonics-button').should('contain', 'Create my account');
	});

	it('Good name for login button', () => {
		cy.get('#ipc-signup-login-button').should('contain', 'Login with my account');
	});

	it('Good name for create account button', () => {
		cy.get('#ipc-signup-create-copy-mnemonics-button').click().should('contain', 'Create my account');
	});

	it('Good name for go to dashboard button', () => {
		cy.get('#ipc-signup-go-to-dashboard-button').should('contain', 'Go to my dashboard');
	});
});

describe('Signup with credentials Button for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
		cy.get('#ipc-signup-create-copy-mnemonics-button').click();
		cy.wait(1000);
		cy.get('#ipc-signup-create-copy-mnemonics-button').click();
	});

	it('Good copied clipboard', () => {
		cy.window()
			.its('navigator.clipboard')
			.invoke('readText')
			.then((clipboard) => {
				cy.get('#ipc-signup-text-area').invoke('val').should('eq', clipboard);
			});
	});

	it('Good URL redirect for close button', () => {
		cy.get('#ipc-signup-go-to-dashboard-button').click().url().should('eq', `${Cypress.config().baseUrl}/drive`);
	});
});

describe('Login Button for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
	});

	it('Good URL redirect for login button', () => {
		cy.get('#ipc-signup-login-button').click().url().should('eq', `${Cypress.config().baseUrl}/login`);
	});
});
