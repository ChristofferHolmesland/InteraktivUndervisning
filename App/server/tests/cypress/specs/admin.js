describe("Test admin content",function () {
	before(function () {
		//Cypress.Cookies.preserveOnce("sessionId");
		cy.setCookie("sessionId", "test");
	});
	beforeEach(function () {
		Cypress.Cookies.preserveOnce("sessionId");
		cy.visit("localhost:8082/");
		cy.url().should("equal", "http://localhost:8082/");
		cy.get("[data-cy=Language]").click();
		cy.get("#no").should("be.visible").click();
		cy.get("[data-cy=Language]").find("a").should("contain", "Språk");
		cy.get("[data-cy=loginButton] > a > span").should("contain", "testAdmin");
	});
	it("Create a course", function () {
		cy.get("[data-cy=adminOptions] > :nth-child(2) > .nav-link").click();
		cy.url().should("include", "/admin");
		cy.get('[data-cy=addCourseButton]')
			.should("contain", "Legg til")
			.click();
		cy.get(".modal-title").should("contain", "Nytt fag");
		cy.get("#courseName > div > h4").should("contain", "Fag navn:");
		cy.get("#courseCode > div > h4").should("contain", "Fag kode:");
		cy.get("#courseSemester > div > h4").should("contain", "Fag semester:");
		cy.get('[data-cy=addCourseCodeField] > h6')
			.should("contain", "Legg til ny fag kode:")
			.click();
		cy.get('[data-cy=addSemesterField] > h6')
			.should("contain", "Legg til nytt semester:")
			.click();
		cy.wait(500);
		cy.get("#courseSemester > div > :nth-child(3) > .row:nth-child(2) > .container > .row > .col > h6 ").should("contain", "Velg sesong:");
		cy.get("#courseSemester > div > :nth-child(3) > .row:nth-child(3) > .container > .row > .col > h6 ").should("contain", "Velg et år:");
		cy.get("#courseNameInput")
			.should("visible")
			.type("Test Fag");
		cy.get("#courseSeasonSelect")
			.should("have.value", "1")
			.select("2")
			.should("have.value", "2");
		cy.get("#courseYearSelect")
			.should("have.value", "1")
			.select("2")
			.should("have.value", "2");
		cy.get('#addCourseCodeInput')
			.type("TEST100")
			.should("have.value", "TEST100");
		cy.get("[data-cy=NewCourseCodeBtn]")
			.should("contain", "Legg til fag kode")
			.click();
		cy.wait(500);
		cy.get(".alert > p").should("contain", "Inndata feltet for fag koden har feil format.\nKoden skal ha 3 store bokstaver etterfulgt med 3 tall.");
		cy.get('#addCourseCodeInput')
			.clear()
			.type("TET100")
			.should("have.value", "TET100");
		cy.get("[data-cy=NewCourseCodeBtn]").click();
		cy.get("[data-cy=NewSemesterBtn]")
			.should("contain", "Legg til semester")
			.click();
		cy.get("#courseSemesterSelect").should("contain", "2020 Høst");
		cy.get('#newCourseModal___BV_modal_footer_ > .btn-primary')
			.should("contain", "Legg til")
			.click();
		cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(1) > #courseSelect').should("contain", "TET100 Høst 2020");
		//cy.get(':nth-child(2) > ul > li').should("contain", "test -  testAdmin");
		cy.get(":nth-child(3) > .nav-link").click();
		cy.get('#courseSelect').should("contain", "TET100 Høst 2020");
	});
	describe("Create Questions", function () {
		beforeEach(function () {
			cy.get("[data-cy=adminOptions] > :nth-child(3) > .nav-link").click();
			cy.wait(1000);
			cy.get("[data-cy=adminOptions] > :nth-child(3) > .nav-link").click(); //is clicked twice to avoid any loading issues that might occur
			cy.url().should("include", "/questions");
			cy.get("#courseSelect").select("1");
		});
		it("Create and Edit Text question", function () {
			let title = "Title Text Test";
			let info = "Info Text Test";
			let time = "01:30";
			let questionType = "Tekst";
			let solution = "Solution Text Test";
			let titleEdited = "Title Edited Text Test";
			let infoEdited = "Info Edited Text Test";
			let timeEdited = "00:00";
			let solutionEdited = "Solution Edited Text Test";

			cy.get("[data-cy=addQuestionButton]").click();
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");	//is open by default, therefore no clicks are necessary
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.wait(500);
			cy.get("#questionTitleInput").type(title);
			cy.wait(500);
			cy.get("#questionTextInput").type(info);
			cy.wait(500);
			cy.get("#questionTimeInput").type(time);
			cy.wait(500);
			cy.get("#solutionTypeInput").select("Text");
			cy.wait(500);
			cy.get("#solutionInputText").type(solution);
			cy.get('#editQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//show current question information
			cy.wait(500);
			cy.get(".list-group > :nth-child(1) > div:nth-child(1)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(1) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(1)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain",questionType);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(2)").should("contain", solution);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();

			//check editfunction works, and then use it to edit the previously made question.
			cy.get(".list-group > :nth-child(1) > div:nth-child(1)")
				.find(".btn-primary > i")
				.click();
			cy.wait(500);
			cy.get('[data-cy=solutionType] > label').click();
			cy.get('#questionTitleInput')
				.should("have.value", title)
				.clear()
				.type(titleEdited);
			cy.get('#questionTextInput')
				.should("have.value", info)
				.clear()
				.type(infoEdited);
			cy.get("#questionTimeInput").type(timeEdited);
			cy.get('#solutionInputText')
				.should("have.value", solution)
				.clear()
				.type(solutionEdited);
			cy.get('#editQuestionModal___BV_modal_footer_ > .btn-primary').click();

			//check that the question has been edited
			cy.get(".list-group > :nth-child(1)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(1) > .container > .row > div").should("contain", titleEdited);
			cy.get(".list-group > :nth-child(1) > div:nth-child(1)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", titleEdited);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", infoEdited);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", timeEdited);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain",questionType);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(2)").should("contain", solutionEdited);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create and Edit Multichoice question", function () {
			let title = "Title Multichoice Test";
			let info = "Info Multichoice Test";
			let time = "02:00";
			let questionType = "Flervalg";
			let choice1 = "The first choice";
			let choice2 = "The second choice";
			let choice3 = "The chosen choice";
			let choice4 = "The chosen choice again :)";
			let choice1Edited = "The first Edited choice";
			let choice2Edited = "The second Edited choice";
			let solutionEdited = "The true chosen element";
			let titleEdited = "Title Edited Multichoice Test";
			let infoEdited = "Info Edited Multichoice Test";
			let timeEdited = "00:00";

			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create multi choice question
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Multiple choice");
			cy.get('#addNewMultipleChoice')
				.should("contain", "Legg til nytt alternativ")
				.click()
				.click()
				.click()
				.click()
				.click();
			cy.get('#multipleChoiceChoices > div > div > div:nth-child(2) > div > div > .row:nth-child(1) > .col-2 .btn')
				.should("contain", "Slett")
				.click();
			cy.wait(500);
			cy.get("#multipleChoiceChoices").find("input#0.form-control").type(choice1);
			cy.get("#multipleChoiceChoices").find("input#1.form-control").type(choice2);
			cy.get("#multipleChoiceChoices").find("input#2.form-control").type(choice3);
			cy.get("#multipleChoiceChoices").find("input#3.form-control").type(choice4);
			cy.get(":nth-child(3) > .col-1 > .custom-control").click();
			cy.get(":nth-child(4) > .col-1 > .custom-control").click();
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show current question information
			cy.get(".list-group > :nth-child(1) > div:nth-child(2)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(2) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(2)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain",questionType);
			cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(1) > :nth-child(1) > h6").should("contain","Alternativer:");
			cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(1) > :nth-child(2) > h6").should("contain","Riktig:");
			for (let i = 2; i <= 5; i++) {
				for (let j = 1; j <= 2; j++) {
					if (i === 2 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice1);
					else if (i === 2 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Nei");
					else if (i === 3 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice2);
					else if (i === 3 && j === 2)	cy.get("[data-cy=showModal").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Nei");
					else if (i === 4 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice3);
					else if (i === 4 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Ja");
					else if (i === 5 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice4);
					else if (i === 5 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Ja");
				}
			}
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();

			cy.get(".list-group > :nth-child(1) > div:nth-child(2)")
				.find(".btn-primary > i")
				.click();
			cy.get('#solutionType > [role="group"] > .px-0 > .row > .col-10 > label').click();
			cy.wait(500);
			cy.get('#questionTitleInput')
				.should("have.value", title)
				.clear()
				.type(titleEdited);
			cy.get('#questionTextInput')
				.should("have.value", info)
				.clear()
				.type(infoEdited);
			cy.get("#questionTimeInput").type(timeEdited);
			cy.get("#multipleChoiceChoices > div > div > div:nth-child(2) > div > div > :nth-child(4) > .col-2 > .btn").click();
			cy.get("#multipleChoiceChoices > div > div > div:nth-child(2) > div > div > :nth-child(3) > .col-2 > .btn").click();
			cy.get('#addNewMultipleChoice').click();
			cy.wait(500);
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
			cy.get(".list-group > :nth-child(1) > div:nth-child(2)").should("be.visible");
			cy.get(".list-group > :nth-child(1) > div:nth-child(2)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", titleEdited);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", infoEdited);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", timeEdited);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();

			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain",questionType);
			cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(1) > :nth-child(1) > h6").should("contain","Alternativer:");
			cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(1) > :nth-child(2) > h6").should("contain","Riktig:");
			for (let i = 2; i <= 5; i++) {
				for (let j = 1; j <= 2; j++) {
					if (i === 2 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice1Edited);
					else if (i === 2 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Nei");
					else if (i === 3 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",choice2Edited);
					else if (i === 3 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Nei");
					else if (i === 4 && j === 1)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain",solutionEdited);
					else if (i === 4 && j === 2)	cy.get("[data-cy=showModal]").find(".modal-body > div:nth-child(2) > div:nth-child(2) > div > :nth-child(2) > :nth-child(" + i + ") > :nth-child(" + j + ") > p").should("contain","Ja");
				}
			}
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create ShellSort question", function () {
			let title = "Title ShellSort Test";
			let info = "Info ShellSort Test";
			let time = "03:00";
			let arrayValues = "2,88,11,36,66,37,29,15,62,10";
			let k = '5';
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create ShellSort
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.wait(500);
			cy.get("#solutionTypeInput").select("Shellsort");
			cy.get('#sortingSolution__BV_label_').should("has.text", "Start liste (elementer sepereres med ,)");
			cy.get('#kValue__BV_label_').should("has.text", "K start verdi");
			cy.get('#sortingSolution > :nth-child(2) > #solutionInput').type(arrayValues);
			cy.get('#kValueInput').type(k);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show current question information
			cy.get(".list-group > :nth-child(1) > div:nth-child(3)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(3) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(3)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Shellsortering");
			cy.get("#ShellsortMainContainer").should("be.visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create MergeSort question", function () {
			let title = "Title MergeSort Test";
			let info = "Info MergeSort Test";
			let time = "03:30";
			let arrayValues = "12,78,55,28,40,62,81,57,51,25";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create MergeSort
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("MergeSort");
			cy.wait(500);
			cy.get('#sortingSolution__BV_label_').should("contain", "Start liste (elementer sepereres med ,)");
			cy.get('#sortingSolution > div > #solutionInput').type(arrayValues);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show Mergesort
			cy.get(".list-group > :nth-child(1) > div:nth-child(4)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(4) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(4)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Flette sortering");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create QuickSort question",function () {
			let title = "Title QuickSort Test";
			let info = "Info QuickSort Test";
			let time = "04:00";
			let arrayValues = "14,98,91,21,14,68,18,25,47,88";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create QuickSort
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("QuickSort");
			cy.wait(500);
			cy.get('#sortingSolution__BV_label_').should("contain", "Start liste (elementer sepereres med ,)");
			cy.get('#sortingSolution > div > #solutionInput').type(arrayValues);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show Quicksort
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(5)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(5) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(5)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Quicksort");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create BinaryTree question",function () {
			let title = "Title BinaryTree Test";
			let info = "Info BinaryTree Test";
			let time = "04:30";
			let treeElements = "45,48,50,6,3";
			let solution = "Det ville blitt regnet som riktig svar hvis treet som ble gitt følger alle reglene til et Binear Tree og treet besto av følgende noder:";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create Binary Tree
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("BinaryTree");
			cy.wait(500);
			cy.get('#BinaryTree__BV_label_').should("contain","Skriv inn listen av noder som skal bli brukt i binærtreet. Elementene skal sepereres med bruk av ,");
			cy.get('#nodeElements').type(treeElements);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show BinaryTree
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(6)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(6) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(6)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Binærtre");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(2)").should("contain", solution);
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create Binary Search Tree question",function () {
			let title = "Title BinarySearchTree Test";
			let info = "Info BinarySearchTree Test";
			let time = "05:00";
			let treeElements = "35,86,23,73,54";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create Binary Search Tree
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("BinarySearchTree");
			cy.get('#BinarySearchTrees__BV_label_').should("contain","Tegn treet, eller gi en liste for å generere løsningen");
			cy.get("#Add").click();
			cy.get("label[for=\"solutionListElements\"]").should("contain","Skriv inn elementer som skal legges til treet. Elementene skal sepereres med bruk av ,");
			cy.get("#Remove").click();
			cy.get("label[for=\"solutionListElements\"]").should("contain","Skriv inn elementer som skal fjernes fra treet. Elementene skal sepereres med bruk av ,");
			cy.get("#Add").click();
			cy.wait(500);
			cy.get('#solutionListElements').type(treeElements);
			cy.get("#canvas").should("visible");
			cy.get("#canvas")
				.should("visible")
				.trigger("mousedown", {offsetX: 100, offsetY: 100})
				.trigger("mousedown", {offsetX: 200, offsetY: 200})
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousedown", {offsetX: 400, offsetY: 580})		//join button
				.trigger("mousedown", {offsetX: 100, offsetY: 100})
				.trigger("mouseup", {offsetX: 200, offsetY: 200})		//join the two nodes created
				.trigger("mousedown", {offsetX: 300, offsetY: 580})		//move button
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousemove", {offsetX: 450,offsetY: 350})		//move cursor
				.trigger("mouseup", {offsetX: 450, offsetY: 350})		//release cursor to finish moving the node
				.trigger("mousedown", {offsetX: 500, offsetY: 580})		//edit button
				.trigger("mousedown", {offsetX: 200, offsetY: 580})		//remove button
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousedown", {offsetX:100, offsetY: 100})
				.trigger("mousedown", {offsetX:200, offsetY: 200})
				.trigger("mousedown", {offsetX:450, offsetY:350});
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show Binary Search Tree
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(7)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(7) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(7)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Binært søketre");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create AVL Tree question",function () {
			let title = "Title AVLTree Test";
			let info = "Info AVLTree Test";
			let time = "05:30";
			let treeElements = "4,56,71,12,93";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create AVL Tree
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("AVLTree");
			cy.get('#BinarySearchTrees__BV_label_').should("contain","Tegn treet, eller gi en liste for å generere løsningen");
			cy.get("#Add").click();
			cy.get("label[for=\"solutionListElements\"]").should("contain","Skriv inn elementer som skal legges til treet. Elementene skal sepereres med bruk av ,");
			cy.get("#Remove").click();
			cy.get("label[for=\"solutionListElements\"]").should("contain","Skriv inn elementer som skal fjernes fra treet. Elementene skal sepereres med bruk av ,");
			cy.get("#Add").click();
			cy.wait(500);
			cy.get('#solutionListElements').type(treeElements);
			cy.get("#canvas")
				.should("visible")
				.trigger("mousedown", {offsetX: 100, offsetY: 100})
				.trigger("mousedown", {offsetX: 200, offsetY: 200})
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousedown", {offsetX: 400, offsetY: 580})		//join button
				.trigger("mousedown", {offsetX: 100, offsetY: 100})
				.trigger("mouseup", {offsetX: 200, offsetY: 200})		//join the two nodes created
				.trigger("mousedown", {offsetX: 300, offsetY: 580})		//move button
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousemove", {offsetX: 450,offsetY: 350})		//move cursor
				.trigger("mouseup", {offsetX: 450, offsetY: 350})		//release cursor to finish moving the node
				.trigger("mousedown", {offsetX: 500, offsetY: 580})		//edit button
				.trigger("mousedown", {offsetX: 200, offsetY: 580})		//remove button
				.trigger("mousedown", {offsetX: 400, offsetY: 300})
				.trigger("mousedown", {offsetX:100, offsetY: 100})
				.trigger("mousedown", {offsetX:200, offsetY: 200})
				.trigger("mousedown", {offsetX:450, offsetY:350});
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show AVL Tree
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(8)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(8) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(8)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","AVLTree");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create Dijkstra question",function () {
			let title = "Title Dijkstra Test";
			let info = "Info Dijkstra Test";
			let time = "06:00";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create Dijkstra
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Dijkstra");
			cy.get("#canvas")
				.trigger("mousedown", { offsetX: 50, offsetY: 580})		//add button
				.trigger("mousedown", { offsetX: 200, offsetY: 200})
				.trigger("mousedown", { offsetX: 300, offsetY: 200})
				.trigger("mousedown", { offsetX: 200, offsetY: 300})
				.trigger("mousedown", { offsetX: 300, offsetY: 300})
				.trigger("mousedown", { offsetX: 500, offsetY: 500})
				.trigger("mousedown", { offsetX: 400, offsetY: 580})	//join button
				.trigger("mousedown", { offsetX: 200, offsetY:200})
				.trigger("mouseup", { offsetX: 300, offsetY:200})
				.trigger("mousedown", { offsetX: 300, offsetY:200})
				.trigger("mouseup", { offsetX:300, offsetY:300})
				.trigger("mousedown", { offsetX:300, offsetY:300})
				.trigger("mouseup", { offsetX:200, offsetY:300})
				.trigger("mousedown", { offsetX:200, offsetY:300})
				.trigger("mouseup", { offsetX:200, offsetY:200})
				.trigger("mousedown", { offsetX:700, offsetY:580})		//mark button
				.trigger("mousedown", { offsetX:200, offsetY:200})
				.trigger("mousedown", { offsetX:300, offsetY:300});
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show Dijkstra
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(9)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(9) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(9)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Dijkstra");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
		it("Create and Edit Python question",function () {
			let title = "Title Python Test";
			let info = "Info Python Test";
			let titleEdited = "Title Edited Python Test";
			let infoEdited = "Info Edited Python Test";
			let time = "06:30";
			let timeEdited = "00:00";
			let python = "class Navn:\n" +
				"\n" +
				"    def __init__(self, fornavn, etternavn):\n" +
				"\n" +
				"        self.fornavn = fornavn\n" +
				"\n" +
				"        self.etternavn = etternavn\n" +
				"\n" +
				"\n" +
				"\n" +
				"class Person:\n" +
				"\n" +
				"    def __init__(self, navn, alder):\n" +
				"\n" +
				"        self.navn = navn\n" +
				"\n" +
				"        self.alder = alder\n" +
				"\n" +
				"\n" +
				"\n" +
				"a = 22\n" +
				"\n" +
				"n = Navn(\"F\", \"T\")\n" +
				"\n" +
				"p = Person(n, a)\n" +
				"\n" +
				"\n" +
				"\n" +
				"a = 23";
			let pythonEdited = "class Punkt:\n" +
				"\n" +
				"    def __init__(self, x, y):\n" +
				"\n" +
				"        self.x = x\n" +
				"\n" +
				"        self.y = y\n" +
				"\n" +
				"\n" +
				"\n" +
				"class Linje:\n" +
				"\n" +
				"    def __init__(self, p1, p2):\n" +
				"\n" +
				"        self.p1 = p1\n" +
				"\n" +
				"        self.p2 = p2\n" +
				"\n" +
				"\n" +
				"\n" +
				"p1 = Punkt(0, 0)\n" +
				"\n" +
				"p2 = Punkt(1, 1)\n" +
				"\n" +
				"l1 = Linje(p1, p2)\n" +
				"\n" +
				"\n" +
				"\n" +
				"p1.x = 5\n" +
				"\n" +
				"l1.p2.x = 5";
			cy.get("[data-cy=addQuestionButton]").click();
			cy.wait(500);

			//create Python
			cy.get("#editQuestionModal___BV_modal_header_ > .modal-title").should("contain", "Nytt spørsmål");
			cy.get('[data-cy=basicInformation] > label').should("contain", "Grunnleggende Informasjon:");
			cy.get("#questionTitleInput").type(title);
			cy.get("#questionTextInput").type(info);
			cy.get("#questionTimeInput").type(time);
			cy.get('[data-cy=solutionType] > label')
				.should("contain", "Løsnings type")
				.click();
			cy.get("#solutionTypeInput").select("Python");
			cy.wait(500);
			cy.get('#pythonCodeInput').type(python);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//show Python
			cy.get('.list-group').scrollTo("bottom");
			cy.get(".list-group > :nth-child(1) > div:nth-child(10)").should("be.visible");
			cy.get(".list-group > div > div:nth-child(10) > .container > .row > div").should("contain", title);
			cy.get(".list-group > :nth-child(1) > div:nth-child(10)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", title);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", info);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", time);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Python");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();

			//Edit Python
			cy.get(".list-group > :nth-child(1) > div:nth-child(10)")
				.find(".btn-primary > i")
				.click();
			cy.get('#solutionType > [role="group"] > .px-0 > .row > .col-10 > label').click();
			cy.wait(500);
			cy.get('#questionTitleInput')
				.should("have.value", title)
				.clear()
				.type(titleEdited);
			cy.get('#questionTextInput')
				.should("have.value", info)
				.clear()
				.type(infoEdited);
			cy.get("#questionTimeInput").type(timeEdited);
			cy.get("#solutionTypeInput").select("Python");
			cy.wait(500);
			cy.get('#pythonCodeInput')
				.clear()
				.type(pythonEdited);
			cy.get("#editQuestionModal___BV_modal_footer_ > .btn-primary").click();

			//Check that python has been edited
			cy.get(".list-group > div > div:nth-child(10) > .container > .row > div").should("contain", titleEdited);
			cy.get(".list-group > :nth-child(1) > div:nth-child(10)")
				.find(".btn-warning")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-title").should("contain", titleEdited);
			cy.get(".modal-body > :nth-child(1) > div:nth-child(1) > div:nth-child(1) > h4").should("contain","Grunnleggende Informasjon:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(1)").should("contain","Beskrivelse:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(2)").should("contain", infoEdited);
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(3)").should("contain", "Tid:");
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(1) > div:nth-child(2) > div > :nth-child(4)").should("contain", timeEdited);
			cy.wait(100);
			cy.get(".modal-body > :nth-child(2) > div > div:nth-child(1) > h4")
				.should("contain", "Løsning:")
				.click();
			cy.get("[data-cy=showModal]").find(".modal-body > :nth-child(2) > div:nth-child(2) > div > :nth-child(1)").should("contain","Python");
			cy.get("#canvas").should("visible");
			cy.wait(1000);
			cy.get("[data-cy=showModal]").find(".modal-footer > .btn-primary").click();
		});
	});
	describe("Create Session",function () {
		beforeEach(function () {
			cy.get("[data-cy=adminOptions] > :nth-child(4) > .nav-link").click();
			cy.wait(1000);
			cy.get("[data-cy=adminOptions] > :nth-child(4) > .nav-link").click(); //is clicked twice to avoid any loading issues that might occur
			cy.url().should("include", "/sessions");
		});
		it("Create a Session", function () {
			cy.get("#courseSelect").select("TET100 Høst 2020");
			cy.get("#AddNewSession").click();
			cy.wait(500);
			cy.get("#sessionTitleInput").type("Test Session");
			cy.get("#questionsSelect").select("1");
			cy.get("form").should("contain", "Spørsmål i økten");
			cy.get("form > fieldset").find(".container > .row > div:nth-child(1)").should("contain","Title Edited Text Test");
			cy.get("form > fieldset > div > .list-group-item").find(".align-right > .btn").should("contain","Fjern");
			cy.get("#newSessionModal___BV_modal_footer_ > .btn-primary").click();
			cy.get("[data-cy=sessionList] > .list-group-item:nth-child(1) > .container > .row > :nth-child(1)").should("contain","Test Session");
			cy.get(".underline").should("contain","Inaktiv");
			cy.get("#sessions").find(".selected").should("contain","Title Edited Text Test");
			cy.get("div.card > div > .tab-content").find("h1").should("contain","Title Edited Text Test");
			cy.get("div.card > div > .tab-content").find("h4").should("contain","Text");
			cy.get("div.card > div > .tab-content").find("p").should("contain","Info Edited Text Test");
			cy.get(".card-header > ul > li:nth-child(2) > a").click();
			cy.get(".card div:nth-child(2) > div:nth-child(2)").find("h4").should("contain","Solution Edited Text Test");
		})
	});
});