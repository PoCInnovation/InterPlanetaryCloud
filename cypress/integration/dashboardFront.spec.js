let dashboardSpecMnemonic = '';

describe('Create account for DashboardView tests', () => {
	it('Connect', () => {
		cy.visit('/signup');
		cy.wait(1000);
		cy.get('#ipc-signupView-credentials-signup-button').click();
		cy.get('#ipc-signupView-text-area')
			.invoke('val')
			.then((input) => {
				dashboardSpecMnemonic = input;
			});
		cy.get('#ipc-modal-close-button').click();
	});
});

describe('Good front for DashboardView', () => {
	it('Go to dashboard view', () => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-loginView-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-loginView-credentials-button').click();
	});

	it('Good title', () => {
		cy.get('#ipc-sideBar-title').should('contain', 'Inter Planetary Cloud');
	});

	it('Good name for upload button', () => {
		cy.get('#ipc-dashboardView-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').should('contain', 'Upload a file');
	});
});

describe('Good Modal Front for DashboardView', () => {
	it('Go to upload modal into dashboard view', () => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-loginView-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-loginView-credentials-button').click().wait(3000);
		cy.get('#ipc-dashboardView-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').click();
	});

	it('Good header', () => {
		cy.get('header').should('contain', 'Upload a file');
	});

	it('Good number of buttons', () => {
		cy.get('button').should('have.length', 8);
	});

	it('Good number of input', () => {
		cy.get('input[type=file]').should('have.length', 1);
	});

	it('Good name for upload a file button', () => {
		cy.get('#ipc-dashboardView-upload-file-modal-button').should('contain', 'Upload file');
	});

	it('Good name for close button', () => {
		cy.get('#ipc-modal-close-button').should('contain', 'Close');
	});
});
