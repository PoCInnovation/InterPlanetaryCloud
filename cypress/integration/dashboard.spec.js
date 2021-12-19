let dashboardSpecMnemonic = '';

describe('Create account', () => {
	it('Connect', () => {
		cy.visit('http://localhost:3000/signup');
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

describe('testing dashboard', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/login');
		cy.wait(1000);
		cy.get('#ipc-loginView-text-area').click().type(dashboardSpecMnemonic);
		cy.get('#ipc-loginView-credentials-button').click();
	});

	it('Good front', () => {
		cy.get('#ipc-sideBar-title').should('contain', 'Inter Planetary Cloud');
		cy.get('#ipc-upload-button').should('contain', 'Upload a file');
	});

	it('Good Modal Front', () => {
		cy.get('#ipc-upload-button').click();
		cy.get('header').should('contain', 'Upload a file');
		cy.get('button').should('have.length', 3);
		cy.get('input[type=file]').should('have.length', 1);
		cy.get('#ipc-dashboardView-upload-file-modal-button').should('contain', 'Upload file');
		cy.get('#ipc-modal-close-button').should('contain', 'Close');
	});

	it('Upload a file', () => {
		cy.get('#ipc-upload-button').click();
		const fixtureFile = 'upload_test_file.txt';
		cy.get('#ipc-dashboardView-upload-file').attachFile(fixtureFile);
		cy.get('#ipc-dashboardView-upload-file-modal-button').click();
		cy.wait(2500);
		cy.get('button').should('have.length', 2);
	});

	it('Close Modal Upload a file', () => {
		cy.get('#ipc-upload-button').click();
		cy.get('#ipc-modal-close-button').click();
		cy.get('button').should('have.length', 2);
	});

	it('Download file', () => {
		cy.get('#ipc-dashboardView-download-button').click();
		cy.wait(3000);
		cy.readFile('./cypress/downloads/upload_test_file.txt').should('eq', 'This is an upload test file');
	});
});
