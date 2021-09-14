describe('testing signup ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/signup');
		cy.wait(1000);
	});
	it('Does not do much!', () => {
		expect(true).to.equal(true);
	});
});
