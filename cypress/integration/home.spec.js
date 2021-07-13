describe('testing home ...', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.wait(2000)
    })
    it('can see app name', () => {
        cy.get('h1').first().should('contain', 'Inter Planetary Cloud')
    })
    it('can see and click signup btn', () => {
        cy.get('a').eq(1).should('have.attr', 'href', '/signup')
            .find('button').should('contain', 'Create an account')
        cy.get('a').eq(1).click().url().should('eq', 'http://localhost:3000/signup')
    })
    it('can see and click login btn', () => {
        cy.get('a').eq(0).should('have.attr', 'href', '/login')
            .find('button').should('contain', 'Login')
        cy.get('a').eq(0).click().url().should('eq', 'http://localhost:3000/login')
    })
})