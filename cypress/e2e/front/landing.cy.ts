describe('Good front for Landing', () => {
	it('Go to landing', () => {
		cy.visit('');
	});

	it ('Good text', () => {
		cy.get('#ipc-landing-navigation-name').should('contain', 'Inter Planetary Cloud');
		cy.get("#ipc-landing-headline").should('contain', 'The first distributed cloud unsealing your data.');
		cy.get("#ipc-landing-subHeadline").should('contain', 'Build on top of Aleph, the next generation network of distributed big data applications.');
		cy.get("#ipc-landing-services-title").should('contain', 'Inter Planetary Cloud offers two services');
		cy.get("#ipc-landing-features-title").should('contain', 'Our Features');
	})

	it('Good text for features cards', () => {
		cy.get("#ipc-landing-feature-upload-files").should('contain', 'Upload & Download Files');
		cy.get("#ipc-landing-folder-management").should('contain', 'Folder Management');
		cy.get("#ipc-landing-share-files").should('contain', 'Share Files');
		cy.get("#ipc-landing-programs").should('contain', 'Upload & Run Programs');
		cy.get("#ipc-landing-contact-management").should('contain', 'Contact Management');
	})

	it('Good text for services cards', () => {
		cy.get("#ipc-landing-services-cloud-storage-title").should('contain', 'Cloud Storage');
		cy.get("#ipc-landing-services-cloud-storage-description").should('contain', 'A distributed personal file storage and management system platform, protecting your data.');
		cy.get('#ipc-landing-services-cloud-computing-title').should('contain', 'Cloud Computing');
		cy.get('#ipc-landing-services-cloud-computing-description').should('contain', 'A distributed personal cloud computing platform for HTTP servers.');
	});

	it('Good text for start buttons', () => {
		cy.get("#ipc-landing-heading-start-button").should('contain', 'Start the experiment');
		cy.get("#ipc-landing-features-start-button").should('contain', 'Start the experiment');
	})

	it('Good number of elements', () => {
		cy.get("button").should('have.length', 2);
		cy.get('img').should('have.length', 7);
		cy.get('svg').should('have.length', 14);
		cy.get('#ipc-landing-services-cloud-storage').should('have.length', 1);
		cy.get('#ipc-landing-services-cloud-computing').should('have.length', 1);
	})
});

describe('Good redirect for Landing', () => {
	beforeEach(() => {
		cy.visit('');
	});

	it('Good redirection for heading button', () => {
		cy.get("#ipc-landing-heading-start-button").click().url().should('eq', `${Cypress.config().baseUrl}/connection`);
	});

	it('Good redirection for features button', () => {
		cy.get("#ipc-landing-features-start-button").click().url().should('eq', `${Cypress.config().baseUrl}/connection`);
	});
});