let dashboardSpecMnemonic = '';

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

describe('Upload a file modal for Dashboard', () => {
	const fixtureFile = 'upload_test_file.txt';

	beforeEach(() => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click().wait(3000);
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').click().wait(2500);
	});

	it('Good number of buttons after upload', () => {
		cy.get('#ipc-dashboard-upload-file').attachFile(fixtureFile);
		cy.get('#ipc-dashboard-upload-file-modal-button').click();
		cy.wait(2000);
		cy.get('button').should('have.length', 12);
	});

	it('Good number of buttons after closing modal', () => {
		cy.get('#ipc-modal-close-button').click();
		cy.get('button').should('have.length', 12);
	});
});

describe('Download a file in Dashboard', () => {
	beforeEach(() => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click();
		cy.wait(2500);
		cy.get('#ipc-dashboard-download-button').click();
		cy.wait(3000);
	});

	it('Good content for downloaded file', () => {
		cy.readFile('./cypress/downloads/upload_test_file.txt').should('eq', 'This is an upload test file');
	});
});

describe('Upload an empty file in Dashboard', () => {
	const fixtureFile = 'upload_empty_file.txt';

	beforeEach(() => {
		cy.visit('/login');
		cy.wait(1000);
		cy.get('#ipc-login-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-login-credentials-button').click().wait(3000);
		cy.get('#ipc-dashboard-drawer-button').click({ force: true });
		cy.get('#ipc-upload-button').click().wait(2500);
	});

	it('Good number of buttons after failed upload', () => {
		cy.get('#ipc-dashboard-upload-file').attachFile(fixtureFile, { allowEmpty: true });
		cy.get('#ipc-dashboard-upload-file-modal-button').click();
		cy.wait(2000);
		cy.get('button').should('have.length', 12);
	});
});
