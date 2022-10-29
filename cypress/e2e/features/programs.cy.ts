describe('Programs', () => {
	const fixtureFile = 'upload_test_program.zip';

	it("Signup for program tests", () => {
		cy.signup();
	});

	it('Good number of buttons after deployment', () => {
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('.ipc-new-elem-button').click();
		cy.get('#ipc-deploy-button').click({ force: true }).wait(2500);
		cy.get('#ipc-dashboard-deploy-program').attachFile(fixtureFile);
		cy.get('#ipc-dashboard-deploy-program-modal-button').click();
		cy.get('#chakra-toast-portal').contains('Program uploaded')
	});
});
