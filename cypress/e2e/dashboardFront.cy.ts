describe('Create account for Dashboard tests', () => {
	it('Connect', () => {
		cy.visit('/signup');
		cy.wait(1000);
		cy.get('#ipc-signup-credentials-signup-button').click();
		cy.get('#ipc-signup-text-area')
			.invoke('val')
			.then((input) => {
				dashboardSpecMnemonic = input as string;
			});
		cy.get('#ipc-modal-close-button').click();
	});
});

describe('Good front for Dashboard', () => {
	it('Go to dashboard', () => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click();
	});

	it('Good title', () => {
		cy.get('#ipc-sideBar-title').should('contain', 'Inter Planetary Cloud');
	});

	it('Good name for upload button', () => {
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').should('contain', 'Upload a file');
	});
});

describe('Good Modal Front for Dashboard', () => {
	it('Go to upload modal into dashboard', () => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click().wait(3000);
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').click();
	});

	it('Good header', () => {
		cy.get('header').should('contain', 'Upload a file');
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 10);
	});

	it('Good number of input', () => {
		cy.get('input[type=file]').should('have.length', 1);
	});

	it('Good name for upload a file button', () => {
		cy.get('#ipc-dashboard-upload-file-modal-button').should('contain', 'Upload file');
	});

	it('Good name for close button', () => {
		cy.get('#ipc-modal-close-button').should('contain', 'Close');
	});
});
