describe('Create account for Dashboard tests', () => {
	it('Connect', () => {
		cy.visit('/signup');
		cy.get('#ipc-signup-credentials-signup-button').click();
		cy.get('#ipc-signup-text-area')
			.invoke('val')
			.then((input) => {
				dashboardSpecMnemonic = input as string;
			});
		cy.get('#ipc-modal-close-button').click();
	});
});

describe('Deploy a program modal for Dashboard', () => {
	const fixtureFile = 'upload_test_program.zip';

	beforeEach(() => {
		cy.visit('/login');
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click();
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('.ipc-new-elem-button').click();
		cy.get('#ipc-deploy-button').click({ force: true }).wait(2500);
	});

	it('Good number of buttons after deployment', () => {
		cy.get('#ipc-dashboard-deploy-program').attachFile(fixtureFile);
		cy.get('#ipc-dashboard-deploy-program-modal-button').click();
		cy.wait(20000);
		cy.get('button').should('have.length', 13);
	});

	it('Good number of buttons after closing modal', () => {
		cy.get('#ipc-modal-close-button').click();
		cy.get('button').should('have.length', 11);
	});
});
