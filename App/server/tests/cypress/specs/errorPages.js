describe('Test error pages', function () {
	it("Test 404 page",function () {
		cy.visit("localhost:8082");
		cy.visit("localhost:8082/IWishThisWasAValidRoute:(");
		cy.get("h1").should("contain","404");
		cy.get("p").should("contain","Åh nei! Ser ut som noe gikk galt.");
		cy.get(".navbar-brand")
			.should("contain","Interaktiv Undervisning")
			.click();
		cy.url().should("equal","http://localhost:8082/");
		cy.visit("localhost:8082/IStillWishThisWasAValidRoute:(");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("contain","Språk")
			.click();
		cy.get("#en").should("be.visible").click();
		cy.get("[data-cy=Language]")
			.find("a")
			.should("contain","Language");
		cy.get("h1").should("contain","404");
		cy.get("p").should("contain","Uh oh! Look like something broke.");
		cy.get(".btn")
			.should("contain","Go home")
			.click();
		cy.url().should("equal","http://localhost:8082/");
	});
	it("Test 401 page", function () {
		cy.setCookie("sessionId","test");
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8082");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("contain","Språk")
			.click();
		cy.get("#en").should("be.visible").click();
		cy.get("[data-cy=loginButton] > a > span").should("contain","testAdmin");
		cy.get("[data-cy=adminOptions] > :nth-child(2) > .nav-link").click();
		cy.url().should("include","/admin");
		cy.clearCookies();
		cy.visit("localhost:8082/admin");
		cy.url().should("equal","http://localhost:8082/401");
		cy.get(':nth-child(2) > .nav-link').should("contain","Logg inn");
		cy.get("h1").should("contain","Uautorisert!");
		cy.get("p:nth-child(1)").should("contain","Denne siden kan ikke bli autorisert for deg.");
		cy.get("p:nth-child(2)").should("contain","Venligst gå tilbake og logg inn før du prøve å laste inn denne siden.");
		cy.get(".navbar-brand")
			.should("contain","Interaktiv Undervisning")
			.click();
		cy.url().should("equal","http://localhost:8082/");
		cy.visit("localhost:8082/client");
		cy.url().should("equal","http://localhost:8082/401");
		cy.get(':nth-child(2) > .nav-link').should("contain","Logg inn");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("contain","Språk")
			.click();
		cy.get("#en")
			.should("be.visible")
			.click();
		cy.get("[data-cy=Language]")
			.find("a")
			.should("contain","Language");
		cy.get(':nth-child(2) > .nav-link').should("contain","Sign in");
		cy.get("h1").should("contain","Unauthorized!");
		cy.get("p:nth-child(1)").should("contain","The page you have requested can't be authorized for you.");
		cy.get("p:nth-child(2)").should("contain","Please go back and log in before trying to enter this page.");
		cy.get(".btn")
			.should("contain","Go home")
			.click();
		cy.url().should("equal","http://localhost:8082/");
	})
});