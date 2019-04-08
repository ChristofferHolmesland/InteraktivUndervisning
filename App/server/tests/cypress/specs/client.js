describe("Client Tests",function () {
	beforeEach(function () {
		cy.clearCookies();
		cy.visit("localhost:8082");
		cy.get(':nth-child(2) > .nav-link').click();
		cy.get("#anonymousButton").click();
		cy.get("#loginButton").click();
	});
	it("Login as an anonymous user",function () {
		cy.url().should("include","/client");
		cy.get('[data-cy=loginButton]').click();
		cy.get('[data-cy=loginButton] > a > span').should("contain","Anonymous"); //does not work
		cy.get('[data-cy=loginButton] > .dropdown-menu > .dropdown-item').should("be.visible").click();
		cy.url().should("equal","http://localhost:8082/");
	});
	it("Try to join a session and fail, then return to the main page and log out",function () {
		cy.url().should("include","/client");
		cy.get('.Client').find("h1").should("contain","This is the client page");
		cy.get('.text-center > h1').should("have.text","Bli med i økt!");
		cy.get('[data-cy=Language]').find("a").should("have.text","Språk").click();
		cy.get("#en").click();
		cy.get('[data-cy=Language]').find("a").should("have.text","Language");
		cy.get('.text-center > h1').should("have.text","Quick join session!");
		cy.get('[data-cy=joinSession]').type("001");
		cy.get(".btn").click();
		cy.get('.text-center > h1').should("have.text","Error joining session! Try again");
		cy.wait(1000);
		cy.get('.text-center > h1').should("have.text","Quick join session!");
		cy.get(".navbar-brand").click();
		cy.url().should("equal","http://localhost:8082/");
		cy.get("h1").should("have.text","Homepage");
		cy.get('[data-cy=loginButton] > a > span').should("contain","Anonymous");
		cy.get('[data-cy=loginButton] > a > span').click();
		cy.get('[data-cy=loginButton] > .dropdown-menu > .dropdown-item').should("be.visible").click();
		cy.get(':nth-child(2) > .nav-link').should("have.text","Sign in");
		cy.get('[data-cy=Language]').find("a").should("have.text","Language").click();
		cy.get("#no").should("be.visible").click();
		cy.get('[data-cy=Language]').find("a").should("have.text","Språk");
	});
});