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
		cy.get('button').should('have.length', 2);
	});

	it('Good name for signup credentials button', () => {
		cy.get('#ipc-signup-credentials-signup-button').should('contain', 'Signup');
	});

	it('Good name for login button', () => {
		cy.get('#ipc-signup-login-button').should('contain', 'Login');
	});
});

describe('Good Modal front for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
		cy.get('#ipc-signup-credentials-signup-button').click();
	});

	it('Good header', () => {
		cy.get('header').should('contain', 'Your Mnemonics');
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 4);
	});

	it('Good number of text-area', () => {
		cy.get('textarea').should('have.length', 1);
	});

	it('Good name for copy mnemonics button', () => {
		cy.get('#ipc-signup-copy-mnemonics-button').should('contain', 'Copy my mnemonics');
	});

	it('Good name for close button', () => {
		cy.get('#ipc-modal-close-button').should('contain', 'Close');
	});
});

describe('Signup with credentials Button for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
		cy.get('#ipc-signup-credentials-signup-button').click();
		cy.wait(1000);
		cy.get('#ipc-signup-copy-mnemonics-button').click();
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
		cy.wait(1000);
		cy.get('#ipc-modal-close-button').click().url().should('eq', 'http://localhost:8080/dashboard');
	});
});

describe('Login Button for Signup', () => {
	it('Go to signup', () => {
		cy.visit('/signup');
	});

	it('Good URL redirect for login button', () => {
		cy.get('#ipc-signup-login-button').click().url().should('eq', 'http://localhost:8080/login');
	});
});
