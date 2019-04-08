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
		cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Bli med i økt!");
		cy.get('[data-cy=Language]').find("a").should("have.text","Språk").click();
		cy.get("#en").click();
		cy.get('[data-cy=Language]').find("a").should("have.text","Language");
		cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Quick join session!");
		cy.get('[data-cy=joinSession]').type("001");
		cy.get('#JoinRoom > :nth-child(3) > .col-12 > .btn').click();
		//gaute removed the old function so I don't know if we are going to use it again.
		//cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Error joining session! Try again");
		//cy.wait(1000);
		//cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Quick join session!");
		cy.get('#SandBox > .center.margin > .col-12 > h1').should("have.text","Go to sandbox");
		cy.get("#SandBox").find(".col > :nth-child(1)").should("have.text","Practice with different question types.");
		cy.get("#SandBox").find(".col > :nth-child(2)").should("have.text","Play with the graphdrawer to get familiar with the controls.");
		cy.get('#SandBox > :nth-child(3) > .col-12 > .btn').should("have.text","Go");
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
	it("Test Sandbox",function () {
		cy.url().should("include","/client");
		cy.get('#SandBox > :nth-child(3) > .col-12 > .btn')
			.should("have.text","Go")
			.click();
		cy.get('.cursor > :nth-child(1) > h3').should("have.text","Guide");
		for (let i = 1; i < 4; i++) {
			if (i === 1 && i === 2)	cy.get(".jumbotron > .row > .col > :nth-child(" + i + ")").should("contain","text question");
			if (i === 3)	cy.get(".jumbotron > .row > .col > :nth-child(" + i + ")").should("contain", "write the correct answer into this field");
			if (i === 4)	cy.get(".jumbotron > .row > .col > :nth-child(" + i + ")").should("contain", "solution it will not be case sensitive");
		}
		cy.get("#solutionTypeInput").select("Multiple choice");
		for (let j = 1; j < 5; j++) {
			cy.get(".col > .container > .row > :nth-child("+ j+")").find(".selected")
				.click();
			if (j === 1 && j === 2)	cy.get(".jumbotron > .row > .col > :nth-child(" + j + ")").should("contain","multiple choice question");
			if (j === 3)	cy.get(".jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "Click on the boxes that you would like to send as the correct answer.");
			if (j === 4)	cy.get(".jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "which box you have selected for the answer.");
			if (j === 5)	cy.get(".jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "click the Answer button.");
			if (j === 6)	cy.get(".jumbotron > .row > .col > :nth-child(" + j + ")").should("contain" , "only answers with the exact number of boxes selected and the same boxes selected will get a correct answer.");
		}
		cy.get('.jumbotron > .row > .col > :nth-child(1)')

		//cy.get('#solutionTypeInput').select("Tree");
		//cy.get(':nth-child(1) > :nth-child(1) > .row > :nth-child(1) > h3').should("have.text","Settings");
		//cy.get("#canvas").click();
		//cy.get('.jumbotron > .row > .col');
	})
});