//BVID are unpreditable and most likely should use vue data tags instead
describe("Test admin content",function () {
	before(function () {
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.setCookie("sessionId","test");
	});
	beforeEach(function () {
		Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8082/");
		cy.url().should("equal","http://localhost:8082/");
		cy.get("[data-cy=Language]").click();
		cy.get("#no").should("be.visible").click();
		cy.get("[data-cy=Language]").find("a").should("have.text","Språk");
		cy.get("[data-cy=loginButton] > a > span").should("have.text","testAdmin");
	});
	it("Create a course",function () {
		cy.get("[data-cy=adminOptions] > :nth-child(2) > .nav-link").click();
		cy.url().should("include","/admin");
		cy.get('[data-cy=addCourseButton]')
			.should("contain","Legg til")
			.click();
		cy.get(".modal-title").should("have.text","Nytt fag");
		cy.get("#courseName > div > h4").should("have.text","Fag navn:");
		cy.get("#courseCode > div > h4").should("have.text","Fag kode:");
		cy.get("#courseSemester > div > h4").should("have.text","Fag semester:");
		cy.get('[data-cy=addCourseCodeField] > h6')
			.should("have.text","Legg til ny fag kode:")
			.click();
		cy.get('[data-cy=addSemesterField] > h6')
			.should("have.text","Legg til nytt semester:")
			.click();
		cy.get("#courseSemester > div > :nth-child(3) > .row:nth-child(2) > .container > .row > .col > h6 ").should("have.text","Velg sesong:");
		cy.get("#courseSemester > div > :nth-child(3) > .row:nth-child(3) > .container > .row > .col > h6 ").should("have.text","Velg et år:");
		cy.get("#courseNameInput")
			.should("visible")
			.type("Test Fag");
		cy.get("#courseSeasonSelect")
			.should("have.value","1")
			.select("2")
			.should("have.value","2");
		cy.get("#courseYearSelect")
			.should("have.value","1")
			.select("2")
			.should("have.value","2");
		cy.get('#addCourseCodeInput')
			.type("TEST100")
			.should("have.value","TEST100");
		//cy.get("#courseSemesterInput").type("H18");
		//cy.get("#courseNameInput").type("Test");
		cy.get(".col-3 > .btn")
			.should("have.text","Legg til")
			.click();
		cy.get(".alert > p").should("have.text", "Inndata feltet for fag koden har feil format.\nKoden skal ha 3 store bokstaver etterfulgt med 3 tall.");
		cy.get('#addCourseCodeInput')
			.clear()
			.type("TET100")
			.should("have.value","TET100");
		cy.get(".col-3 > .btn").click();
		cy.get('.col-12 > .btn')
			.should("have.text","Legg til")
			.click();
		cy.get("#courseSemesterSelect").should("contain","2020 Høst");
		cy.get('.btn-primary')
			.should("have.text","OK")
			.click();
		cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(1) > #courseSelect').should("contain", "TET100 Høst 2020");
		cy.get(':nth-child(2) > ul > li').should("contain","test -  testAdmin");
		cy.get(":nth-child(3) > .nav-link").click();
		cy.get('#courseSelect').should("contain","TET100 Høst 2020");
	});
	describe("Create questions",function () {
		beforeEach(function () {
			cy.get("[data-cy=adminOptions] > :nth-child(3) > .nav-link").click();
			cy.url().should("include","/questions");
			cy.get("#courseSelect").select("1");
		});
		it("Create and Edit Text question",function () {
			let title = "Title Text Test";
			let info = "Info Text Test";
			let solution = "Solution Text Test";
			let titleEdited = "Title Edited Text Test";
			let infoEdited = "Info Edited Text Test";
			let solutionEdited = "Solution Edited Text Test";

			cy.get("[data-cy=addQuestionButton]").click();

			//check modal information is correct and create a new question by typing information to the input fields and click on the ok button.
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain","Grunnleggende Informasjon");	//is open by default, therefore no clicks are necessary

			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type("01:30");
			cy.get('[data-cy=solutionType] > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Text");
			cy.get("#solutionInput").type(solution);
			cy.get('#editQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get(".list-group > :nth-child(1)").should("be.visible");
			cy.get(":nth-child(1) > .container > .row > .col-8").should("contain",title);
			cy.get(".list-group > :nth-child(1)")
				.find(".container")
				.contains("V")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("have.text",title);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1)").should("have.text",info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2)").should("have.text","Tid: 01:30");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(4)").should("have.text",solution);
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();

			//check editfunction works, and then use it to edit the previously made question.
			cy.get('.list-group > :nth-child(1)')
				.find(".container")
				.contains("E")
				.click();
			cy.get('[data-cy=solutionType] > label').click();
			cy.get('#questionTitleInput')
				.should("have.value",title)
				.clear()
				.type(titleEdited);
			cy.get('#questionTextInput')
				.should("have.value",info)
				.clear()
				.type(infoEdited);
			cy.get("#questionTimeInput").type("00:00");
			cy.get('#solutionInput')
				.should("have.value",solution)
				.clear()
				.type(solutionEdited);
			cy.get('#editQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//check that the question has been edited
			cy.get(".list-group > :nth-child(1)").should("be.visible");
			cy.get(".list-group > div > .list-group-item > .container > .row > .col-8").should("contain",titleEdited);
			cy.get(".list-group > :nth-child(1)")
				.find(".container")
				.contains("V")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("have.text",titleEdited);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1)").should("have.text",infoEdited);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2)").should("have.text","Tid: 00:00");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(4)").should("have.text",solutionEdited);
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});

		it("Create and Edit Multichoice question",function () {
			let title = "Title Multichoice Test";
			let info = "Info Multichoice Test";
			let choice1 = "The first choice";
			let choice2 = "The second choice";
			let choice3 = "The chosen choice";
			let choice4 = "The chosen choice again :)";
			let choice1Edited = "The first Edited choice";
			let choice2Edited = "The second Edited choice";
			let solutionEdited = "The true chosen element";
			let titleEdited = "Title Edited Multichoice Test";
			let infoEdited = "Info Edited Multichoice Test";
			cy.get("[data-cy=addQuestionButton]").click();

			//create multi choice question
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain","Grunnleggende Informasjon");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type("02:00");
			cy.get('[data-cy=solutionType] > label')
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
			cy.pause();
			cy.get('#__BVID__43 > :nth-child(1) > .col-2 > .btn')
				.should("have.text","Slett")
				.click();
			cy.get("#multipleChoiceChoices").find("input#0.form-control").type(choice1);
			cy.get("#multipleChoiceChoices").find("input#1.form-control").type(choice2);
			cy.get("#multipleChoiceChoices").find("input#2.form-control").type(choice3);
			cy.get("#multipleChoiceChoices").find("input#3.form-control").type(choice4);
			cy.get(":nth-child(3) > .col-1 > .custom-control").click();
			cy.get(":nth-child(4) > .col-1 > .custom-control").click();
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show current question information
			cy.get('.list-group > :nth-child(2)').should("be.visible");
			cy.get(':nth-child(2) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(2)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__29___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__29___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__29___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 02:00");
			for (let i = 1; i <= 4; i++) {
				if (i === 1)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice1);
				else if(i === 2)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice2);
				else if (i === 3)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice3);
				else if (i === 4)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" +i+")").should("contain",choice4);
			}
			cy.wait(1000);
			cy.get('#__BVID__29___BV_modal_footer_ > .btn-primary').click();

			//TODO finish edit and check edit for MultiChoice questions after the solution type bug is fixed
			//check editfunction works, and then use it to edit the previously made question.
			cy.get('.list-group > :nth-child(2)')
				.find(".container")
				.contains("E")
				.click();
			cy.get('#solutionType > [role="group"] > .px-0 > .row > .col-10 > label').click();
			cy.get('#questionTitleInput')
				.should("have.value",title)
				.clear()
				.type(titleEdited);
			cy.get('#questionTextInput')
				.should("have.value",info)
				.clear()
				.type(infoEdited);
			cy.get("#questionTimeInput").type("00:00");
			//cy.get(":nth-child(3) > .col-1 > .custom-control").should("have.attr","checked");
			//cy.get(":nth-child(4) > .col-1 > .custom-control").should("have.attr","checked");
			cy.get(":nth-child(4) > .col-2 > .btn").click();
			cy.get(":nth-child(3) > .col-2 > .btn").click();
			cy.get('#addNewMultipleChoice').click();
			cy.get('#multipleChoiceChoices')
				.find("input#0.form-control")
				.clear()
				.type(choice1Edited);
			cy.get("#multipleChoiceChoices")
				.find("input#1.form-control")
				.clear()
				.type(choice2Edited);
			cy.get("#multipleChoiceChoices")
				.find("input#2.form-control")
				.clear()
				.type(solutionEdited);
			cy.get(":nth-child(3) > .col-1 > .custom-control").click();
			cy.get('#editQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//check that the question has been edited
			cy.get('.list-group > :nth-child(2)').should("be.visible");
			cy.get(':nth-child(2) > .container > .row > .col-8').should("contain",titleEdited);
			cy.get('.list-group > :nth-child(2)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__29___BV_modal_header_ > .modal-title').should("have.text",titleEdited);
			cy.get('#__BVID__29___BV_modal_body_ > :nth-child(1)').should("have.text",infoEdited);
			cy.get('#__BVID__29___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: 00:00");
			for (let j = 1; j <= 3; j++) {
				if (j === 1)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" + j +")").should("contain",choice1Edited);
				else if(j === 2)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" + j +")").should("contain",choice2Edited);
				else if (j === 3)	cy.get("#__BVID__29___BV_modal_body_ > .container > :nth-child(" + j +")").should("contain",solutionEdited);
			}
			cy.wait(1000);
			cy.get('#__BVID__29___BV_modal_footer_ > .btn-primary').click();
		});
		/*
		it("Create and Edit ShellSort question",function () {
			let title = "Title ShellSort Test";
			let info = "Info ShellSort Test";
			let titleEdited = "Title Edited ShellSort Test";
			let infoEdited = "Info Edited ShellSort Test";
			let time = "03:00";
			let arrayValues = "2,88,11,36,66,37,29,15,62,10";
			let k = '5';
			cy.get('.pl-0 > [data-v-0ae92b14=""][type="button"]').click();

			//create ShellSort
			cy.get("#newQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			cy.get("#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label")
				.should("contain","Grunnleggende Informasjon")
				.click();
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('#newQuestionModal___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Shellsort");
			cy.get('#sortingSolution__BV_label_').should("has.text","Starting array (elements seperated by ,)");
			cy.get('#kValue__BV_label_').should("has.text","K start value");
			cy.get('#sortingSolution > :nth-child(2) > #solutionInput').type(arrayValues);
			cy.get('#kValueInput').type(k);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get('.list-group > :nth-child(6)').should("be.visible");
			cy.get(':nth-child(6) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(6)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: "+time);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();

			//TODO Write the edit and show edit for shellSort
		});

		it("Create and Edit MergeSort question",function () {
			let title = "Title MergeSort Test";
			let info = "Info MergeSort Test";
			let titleEdited = "Title Edited MergeSort Test";
			let infoEdited = "Info Edited MergeSort Test";
			let time = "03:30";
			let arrayValues = "12,78,55,28,40,62,81,57,51,25";
			cy.get('.pl-0 > [data-v-0ae92b14=""][type="button"]').click();

			//create MergeSort
			cy.get("#newQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			cy.get("#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label")
				.should("contain","Grunnleggende Informasjon")
				.click();
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('#newQuestionModal___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("MergeSort");
			cy.get('#sortingSolution__BV_label_').should("have.text","Starting array (elements seperated by ,)");
			cy.get('#sortingSolution > div > #solutionInput').type(arrayValues);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show Mergesort
			cy.get('.list-group > :nth-child(7)').should("be.visible");
			cy.get(':nth-child(7) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(7)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: "+time);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();
			//TODO finish edit and show edit function for mergesort
			/*cy.get('#sortingSolution__BV_label_').should("has.text","Starting array (elements seperated by ,)");
			cy.get('#kValue__BV_label_').should("has.text","K start value");
			cy.get('#sortingSolution > :nth-child(2) > #solutionInput').type(arrayValues);
			cy.get('#kValueInput').type(k);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get('.list-group > :nth-child(7)').should("be.visible");
			cy.get(':nth-child(7) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(7)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: "+time);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();

		});

		it("Create and Edit QuickSort question",function () {
			let title = "Title QuickSort Test";
			let info = "Info QuickSort Test";
			let titleEdited = "Title Edited QuickSort Test";
			let infoEdited = "Info Edited QuickSort Test";
			let time = "04:00";
			let arrayValues = "14,98,91,21,14,68,18,25,47,88";
			cy.get('.pl-0 > [data-v-0ae92b14=""][type="button"]').click();

			//create QuickSort
			cy.get("#newQuestionModal___BV_modal_header_ > .modal-title").should("have.text","Nytt spørsmål");
			cy.get("#newQuestionModal___BV_modal_body_ > form > :nth-child(1) > .row > .col-10 > label")
				.should("contain","Grunnleggende Informasjon")
				.click();
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('#newQuestionModal___BV_modal_body_ > form > #solutionType > [role="group"] > .px-0 > .row > .col-10 > label')
				.should("contain","Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("MergeSort");
			cy.get('#sortingSolution__BV_label_').should("have.text","Starting array (elements seperated by ,)");
			cy.get('#sortingSolution > div > #solutionInput').type(arrayValues);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show Quicksort
			cy.get('.list-group').scrollTo("bottom");
			cy.get('.list-group > :nth-child(8)').should("be.visible");
			cy.get(':nth-child(8) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(8)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: "+time);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();

			//TODO finish edit and showEdit test to QuickSort
			cy.get('#sortingSolution__BV_label_').should("has.text","Starting array (elements seperated by ,)");
			cy.get('#kValue__BV_label_').should("has.text","K start value");
			cy.get('#sortingSolution > :nth-child(2) > #solutionInput').type(arrayValues);
			cy.get('#kValueInput').type(k);
			cy.get('#newQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.get('.list-group > :nth-child(8)').should("be.visible");
			cy.get(':nth-child(8) > .container > .row > .col-8').should("contain",title);
			cy.get('.list-group > :nth-child(8)')
				.find(".container")
				.contains("V")
				.click();
			cy.get('#__BVID__47___BV_modal_header_ > .modal-title').should("have.text",title);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(1)').should("have.text",info);
			cy.get('#__BVID__47___BV_modal_body_ > :nth-child(2)').should("have.text","Tid: "+time);
			cy.wait(1000);
			cy.get('#__BVID__47___BV_modal_footer_ > .btn-primary').click();
			*/
		//});
	});
});