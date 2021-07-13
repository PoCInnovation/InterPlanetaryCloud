describe('testing signup ...', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/signup')
        cy.wait(1000)
    })
    it('can see signup title', () => {
        cy.get('p').first().should('contain', 'Sign up')
    })
    it('can see, fill and submit signup form', () => {
        cy.get('form').should('have.length', 1)
        cy.get('form').first().get('label').should('have.length', 2)
        cy.get('form').first().get('input').should('have.length', 2)
        cy.get('form').first().get('label').eq(0).should('contain', 'Email')
        cy.get('form').first().get('label').eq(1).should('contain', 'Password')
        cy.get('form').first().get('input').eq(0).type('test.ipc@pocinnovation.com')
        cy.get('form').first().get('input').eq(1).type('azerty')
        cy.get('form').first().get('button').should('have.length', 1).first()
            .should('contain', 'Submit').click()
    })
})