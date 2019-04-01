describe("Test admin stuff",function () {
	before(function () {
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.setCookie("sessionId","test");
	});
	it("test admin",function () {
		cy.visit("localhost:8081");
	});
});