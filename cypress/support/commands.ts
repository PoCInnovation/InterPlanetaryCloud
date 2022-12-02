//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add('signup', () => {
	cy.visit('/signup');
	cy.get('#ipc-signup-credentials-signup-button').click();
	cy.get('#ipc-signup-text-area');
	cy.get('#ipc-modal-close-button').click();
});

Cypress.Commands.add('uploadFile', (file, params = null) => {
	cy.get('#ipc-dashboard-drawer-button').click({ force: true });
	cy.get('.ipc-new-elem-button').click();
	cy.get('#ipc-dashboard-upload-file-button').click({ force: true });
	cy.get('#ipc-dashboard-upload-file').attachFile(file, params);
	cy.get('#ipc-dashboard-upload-file-modal-button').click();
});
