describe('testing home ...', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
		cy.wait(1000);
	});
	it('Does not do much!', () => {
		expect(true).to.equal(true);
	});
});
