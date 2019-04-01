describe("Student tries to join a session",function () {
	beforeEach(function () {
		cy.clearCookies();
		cy.visit("localhost:8081");
		cy.get(':nth-child(2) > .nav-link').click();
		cy.get("#anonymousButton").click();
		cy.get("#loginButton").click();
	});
	it("Try to join a session and fail, then return to the main page and log out",function () {
		cy.url().should("include","/client");
		cy.get('h1[data-v-5f002905=""]').should("have.text","This is the client page");
		cy.get('.text-center > h1').should("have.text","Bli med i økt!");
		cy.get('#__BVID__8__BV_button_').should("have.text","Språk").click();
		cy.get("#en").click();
		cy.get('#__BVID__8__BV_button_').should("have.text","Language");
		console.log("HELLO DAD");
		let x = cy.get(".text-center > h1");
		console.log(x);
		console.log("BYE DAD");
		cy.get('.text-center > h1').should("have.text","Quick join session!");
		cy.get('#__BVID__14').type("001");
		cy.get(".btn").click();
		cy.get('.text-center > h1').should("have.text","Error joining session! Try again");
		cy.wait(1000);
		cy.get('.text-center > h1').should("have.text","Quick join session!");
		cy.get(".navbar-brand").click();
		cy.url().should("equal","http://localhost:8081/");
		cy.get("h1").should("have.text","Homepage");
		cy.get('#__BVID__11__BV_button_ > span').should("contain","Anonymous");
		cy.get('#__BVID__11__BV_button_ > span').click();
		cy.get('#__BVID__11 > .dropdown-menu > .dropdown-item').should("be.visible").click();
		cy.get(':nth-child(2) > .nav-link').should("have.text","Sign in");
		cy.get('#__BVID__8__BV_button_').should("have.text","Language").click();
		cy.get("#no").should("be.visible").click();
		cy.get('#__BVID__8__BV_button_').should("have.text","Språk");
	});
});