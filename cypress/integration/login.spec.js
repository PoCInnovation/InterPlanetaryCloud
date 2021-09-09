describe('testing login ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/login');
		cy.wait(1000);
	});
	it('Does not do much!', () => {
		expect(true).to.equal(true);
	});
});
