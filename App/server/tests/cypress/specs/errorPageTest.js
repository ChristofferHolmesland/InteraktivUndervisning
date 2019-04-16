describe('Test error pages', function () {
	it("Test 404 page",function () {
		cy.visit("localhost:8082");
		cy.visit("localhost:8082/IWishThisWasAValidRoute:(");
		cy.get("h1").should("have.text","404");
		cy.get("p").should("have.text","Åh nei! Ser ut som noe gikk galt.");
		cy.get(".navbar-brand")
			.should("have.text","Interaktiv Undervisning")
			.click();
		cy.url().should("equal","http://localhost:8082/");
		cy.visit("localhost:8082/IStillWishThisWasAValidRoute:(");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("have.text","Språk")
			.click();
		cy.get("#en").should("be.visible").click();
		cy.get("[data-cy=Language]")
			.find("a")
			.should("have.text","Language");
		cy.get("h1").should("have.text","404");
		cy.get("p").should("have.text","Uh oh! Look like something broke.");
		cy.get(".btn")
			.should("have.text","Go home")
			.click();
		cy.url().should("equal","http://localhost:8082/");
	});
	it("Test 401 page", function () {
		cy.setCookie("sessionId","test");
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8082");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("have.text","Språk")
			.click();
		cy.get("#en").should("be.visible").click();
		cy.get("[data-cy=loginButton] > a > span").should("have.text","testAdmin");
		cy.get("[data-cy=adminOptions] > :nth-child(2) > .nav-link").click();
		cy.url().should("include","/admin");
		cy.clearCookies();
		cy.visit("localhost:8082/admin");
		cy.url().should("equal","http://localhost:8082/401");
		cy.get(':nth-child(2) > .nav-link').should("have.text","Logg inn");
		cy.get("h1").should("have.text","Uautorisert!");
		cy.get(".401 > p:nth-child(2)").should("have.text","Denne siden kan ikke bli autorisert for deg.");
		cy.get(".401 > p:nth-child(3)").should("have.text","Venligst gå tilbake og logg inn før du prøve å laste inn denne siden.");
		cy.get(".navbar-brand")
			.should("have.text","Interaktiv Undervisning")
			.click();
		cy.url().should("equal","http://localhost:8082/");
		cy.visit("localhost:8082/client");
		cy.url().should("equal","http://localhost:8082/401");
		cy.get(':nth-child(2) > .nav-link').should("have.text","Logg inn");
		cy.get("[data-cy=Language]")
			.find("a")
			.should("have.text","Språk")
			.click();
		cy.get("#en")
			.should("be.visible")
			.click();
		cy.get("[data-cy=Language]")
			.find("a")
			.should("have.text","Language");
		cy.get(':nth-child(2) > .nav-link').should("have.text","Sign in");
		cy.get("h1").should("have.text","Unauthorized!");
		cy.get(".401 > p:nth-child(2)").should("have.text","The page you have requested can't be authorized for you.");
		cy.get(".401 > p:nth-child(3)").should("have.text","Please go back and log in before trying to enter this page.");
		cy.get(".btn")
			.should("have.text","Go home")
			.click();
		cy.url().should("equal","http://localhost:8082/");
	})
});