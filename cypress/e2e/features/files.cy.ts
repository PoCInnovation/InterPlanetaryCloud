describe('File tests', () => {
	const fixtureFile = 'upload_test_file.txt';

	it('Signup for file tests', () => {
		cy.signup();
	});

	it('Good number of buttons after upload', () => {
		cy.uploadFile(fixtureFile);

		cy.get('.ipc-new-elem-button').click();
		cy.get('#chakra-toast-portal').contains('File uploaded');
	});

	it('Good content for downloaded file', () => {
		cy.get('.ipc-file-popover-button').first().rightclick({ force: true });
		cy.get('#ipc-dashboard-download-button').click({ force: true });
		cy.readFile(`./cypress/downloads/${fixtureFile}`).should('eq', 'This is an upload test file');
		cy.get('#chakra-toast-portal').contains('File downloaded');
	});
});
