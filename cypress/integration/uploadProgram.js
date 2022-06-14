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

describe('Upload a program modal for DashboardView', () => {
	const fixtureFile = 'upload_test_program.zip';

	beforeEach(() => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-loginView-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-loginView-credentials-button').click().wait(3000);
		cy.get('#ipc-dashboardView-drawer-button').click({ force: true });
		cy.get('#ipc-deploy-button').click().wait(2500);
	});

	it('Good number of buttons after upload', () => {
		cy.get('#ipc-dashboardView-upload-program').attachFile(fixtureFile);
		cy.get('#ipc-dashboardView-upload-program-modal-button').click();
		cy.wait(2000);
		cy.get('button').should('have.length', 8);
	});

	it('Good number of buttons after closing modal', () => {
		cy.get('#ipc-modal-close-button').click();
		cy.get('button').should('have.length', 8);
	});
});