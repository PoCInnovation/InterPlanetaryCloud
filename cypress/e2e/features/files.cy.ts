describe('File tests', () => {
	const fixtureFile = 'upload_test_file.txt';
	const emptyFixtureFile = 'upload_empty_file.txt';

	it('Signup for file tests', () => {
		cy.signup();
	});

	it('Good number of buttons after upload', () => {
		cy.uploadFile(fixtureFile);

		cy.get('#chakra-toast-portal').contains('File uploaded');
	});

	it('Good number of buttons after failed upload', () => {
		cy.uploadFile(emptyFixtureFile, { allowEmpty: true });

		cy.get('#chakra-toast-portal').contains('Invalid file');
		cy.get('#ipc-modal-close-button').click();
	});

	it('Good content for downloaded file', () => {
		cy.get('.ipc-file-popover-button').click({ force: true });
		cy.get('#ipc-dashboard-download-button').click({ force: true });
		cy.readFile(`./cypress/downloads/${fixtureFile}`).should('eq', 'This is an upload test file');
		cy.get('#chakra-toast-portal').contains('File downloaded');
	});
});
