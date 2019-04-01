describe("Test admin content",function () {
	before(function () {
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.setCookie("sessionId","test");
	});
	beforeEach(function () {
		Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8081/");
		cy.url().should("equal","http://localhost:8081/");
		cy.get('#__BVID__8__BV_button_').click();
		cy.get("#no").should("be.visible").click();
		cy.get('#__BVID__8__BV_button_').should("have.text","Språk");
		cy.get('#__BVID__9__BV_button_ > span').should("have.text","testAdmin");
	});
	it("Create a course",function () {
		cy.get(':nth-child(1) > :nth-child(2) > .nav-link').click();
		cy.url().should("include","/admin");
		let leggTilFag = cy.get(':nth-child(2) > .pl-0 > :nth-child(1)');
		leggTilFag.should("have.text","Legg til");
		leggTilFag.click();
		cy.get('.modal-title').should("have.text","Nytt fag");
		cy.get("#courseCodeInput").type("TEST100");
		cy.get("#courseSemesterInput").type("H18");
		cy.get("#courseNameInput").type("Test");
		cy.get(".btn-primary").click();
		cy.get('.col-9 > #courseSelect').select("TEST100 H18").should("have.value","TEST100 H18");
		cy.get(':nth-child(3) > .nav-link').click();
	});
	describe("Create questions",function () {
		beforeEach(function () {
			cy.get(':nth-child(3) > .nav-link').click();
			cy.url().should("include","/questions");
			cy.get('#courseSelect').select("TEST100 H18");
		});
		it("Create and Edit Text question",function () {
			cy.get('[data-v-0ae92b14=""][type="button"]').click();
			cy.get('#newQuestionModal___BV_modal_header_ > .modal-title').should("have.text","Nytt spørsmål");
			let grunnleggendeInformasjon = cy.get('#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label');
			grunnleggendeInformasjon.should("contain","Grunnleggende Informasjon");
			grunnleggendeInformasjon.click();
			cy.get("#questionTitleInput").type("Title Text Test");
			cy.get("#questionTextInput").type("Info Text Test");

		});
		/*it("Create and Edit Multichoice question",function () {

		});
		it("Create and Edit ShellSort question",function () {

		});
		it("Create and Edit MergeSort question",function () {

		});
		it("Create and Edit QuickSort question",function () {

		});*/
	});
});