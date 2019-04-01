//NOTE delete the database dev.db before inputing cypress:open in order for these tests to succeed!
describe("Test admin content",function () {
	before(function () {
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.setCookie("sessionId","test");
	});
	beforeEach(function () {
		Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8082/");
		cy.url().should("equal","http://localhost:8082/");
		cy.get("#__BVID__8__BV_button_").click();
		cy.get("#no").should("be.visible").click();
		cy.get("#__BVID__8__BV_button_").should("have.text","Språk");
		cy.get("#__BVID__9__BV_button_ > span").should("have.text","testAdmin");
	});
	it("Create a course",function () {
		cy.get(":nth-child(1) > :nth-child(2) > .nav-link").click();
		cy.url().should("include","/admin");
		let leggTilFag = cy.get(":nth-child(2) > .pl-0 > :nth-child(1)");
		leggTilFag.should("have.text","Legg til");
		leggTilFag.click();
		cy.get(".modal-title").should("have.text","Nytt fag");
		cy.get("#courseCodeInput").type("TEST100");
		cy.get("#courseSemesterInput").type("H18");
		cy.get("#courseNameInput").type("Test");
		cy.get(".btn-primary").click();
		cy.get(".col-9 > #courseSelect").select("TEST100 H18").should("have.value","TEST100 H18");
		cy.get(":nth-child(3) > .nav-link").click();
	});
	describe("Create questions",function () {
		beforeEach(function () {
			cy.get(":nth-child(3) > .nav-link").click();
			cy.url().should("include","/questions");
			cy.get("#courseSelect").select("TEST100 H18");
		});
		/*it("Create and Edit Text question",function () {
			let title = "Title Text Test";
			let info = "Info Text Test";
			let solution = "Solution Text Test";
			let titleEdited = "Title Edited Text Test";
			let infoEdited = "Info Edited Text Test";
			let solutionEdited = "Solution Edited Text Test";
			cy.get('.pl-0 > [data-v-0ae92b14=""][type="button"]').click();

			//check modal information is correct and create a new question by typing information to the input fields and click on the ok button.
			cy.get("#newQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			let grunnleggendeInformasjon = cy.get("#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label");
			grunnleggendeInformasjon.should("contain","Grunnleggende Informasjon");
			grunnleggendeInformasjon.click();
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type("01:30");
			cy.get('#newQuestionModal___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Text");
			cy.get("#solutionInput").type(solution);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get('.list-group > :nth-child(4)').should("be.visible");
			cy.get(':nth-child(4) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(4)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 01:30");
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(4)').should("have.text",solution);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();

			//check editfunction works, and then use it to edit the previously made question.
			cy.get('.list-group > :nth-child(4)')
				.find(".container")
				.contains("E")
				.click();
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label').click();
			cy.get('#__BVID__32___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label').click();
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionTitle > div > #questionTitleInput')
				.should("have.value",title)
				.clear()
				.type(titleEdited);
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionText > div > #questionTextInput')
				.should("have.value",info)
				.clear()
				.type(infoEdited);
			cy.get("#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionTime > [role=\"group\"] > :nth-child(1) > :nth-child(1) > :nth-child(2) > #questionTimeInput").type("00:00");
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(7) > #textSolution > div > #solutionInput')
				.should("have.value",solution)
				.clear()
				.type(solutionEdited);
			cy.get('#__BVID__32___BV_modal_footer_ > .btn-primary').click();

			//check that the question has been edited
			cy.get('.list-group > :nth-child(4)').should("be.visible");
			cy.get(':nth-child(4) > .container > .row > .col-8').should("contain",titleEdited);
			cy.get('.list-group > :nth-child(4)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",titleEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",infoEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(4)').should("have.text",solutionEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 00:00");
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();
		});*/
		it("Create and Edit Multichoice question",function () {
			let title = "Title Multichoice Test";
			let info = "Info Multichoice Test";
			let choice1 = "The first choice";
			let choice2 = "The second choice";
			let choice3 = "The chosen choice";
			let choice4 = "The chosen choice again :)";
			let titleEdited = "Title Edited Multichoice Test";
			let infoEdited = "Info Edited Multichoice Test";
			cy.get('.pl-0 > [data-v-0ae92b14=""][type="button"]').click();

			//create multi choice question
			cy.get("#newQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			let grunnleggendeInformasjon = cy.get("#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label");
			grunnleggendeInformasjon.should("contain","Grunnleggende Informasjon");
			grunnleggendeInformasjon.click();
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type("02:00");
			cy.get('#newQuestionModal___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Multiple choice");
			cy.get('#addNewMultipleChoice')
				.should("contain","Legg til nytt alternativ")
				.click()
				.click()
				.click()
				.click()
				.click();
			cy.get('#__BVID__62 > :nth-child(1) > .col-2 > .btn')
				.should("have.text","Slett")
				.click();
			cy.get('#__BVID__62').find("input#0.form-control").type(choice1);
			cy.get("#__BVID__62").find("input#1.form-control").type(choice2);
			cy.get("#__BVID__62").find("input#2.form-control").type(choice3);
			cy.get("#__BVID__62").find("input#3.form-control").type(choice4);
			cy.get(':nth-child(3) > .col-1 > .custom-control').click();
			cy.get(":nth-child(4) > .col-1 > .custom-control").click();
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get('.list-group > :nth-child(5)').should("be.visible");
			cy.get(':nth-child(5) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(5)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 02:00");
			for (let i = 1; i <= 4; i++) {
				if (i === 1)	cy.get("#__BVID__47___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice1);
				else if(i === 2)	cy.get("#__BVID__47___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice2);
				else if (i === 3)	cy.get("#__BVID__47___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice3);
				else if (i === 4)	cy.get("#__BVID__47___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice4);
			}
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();

			//check editfunction works, and then use it to edit the previously made question.
			cy.get('.list-group > :nth-child(5)')
				.find(".container")
				.contains("E")
				.click();
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label').click();
			cy.get('#__BVID__32___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label').click();
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionTitle > div > #questionTitleInput')
				.should("have.value",title)
				.clear()
				.type(titleEdited);
			cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionText > div > #questionTextInput')
				.should("have.value",info)
				.clear()
				.type(infoEdited);
			cy.get("#__BVID__32___BV_modal_body_ > form > :nth-child(2) > #questionTime > [role=\"group\"] > :nth-child(1) > :nth-child(1) > :nth-child(2) > #questionTimeInput").type("00:00");
			/*cy.get('#__BVID__32___BV_modal_body_ > form > :nth-child(7) > #textSolution > div > #solutionInput')
				.should("have.value",solution)
				.clear()
				.type(solutionEdited);
			cy.get('#__BVID__32___BV_modal_footer_ > .btn-primary').click();*/

			//check that the question has been edited
			/*cy.get('.list-group > :nth-child(4)').should("be.visible");
			cy.get(':nth-child(4) > .container > .row > .col-8').should("contain",titleEdited);
			cy.get('.list-group > :nth-child(4)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",titleEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",infoEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(4)').should("have.text",solutionEdited);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 00:00");
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();
			*/
		});
		/*it("Create and Edit ShellSort question",function () {

		});
		it("Create and Edit MergeSort question",function () {

		});
		it("Create and Edit QuickSort question",function () {

		});*/
	});
});