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
		cy.get('[data-cy=loginButton] > a > span').should("contain","Anonym");
		cy.get('[data-cy=loginButton] > .dropdown-menu > .dropdown-item')
			.should("be.visible")
			.click();
		cy.url().should("equal","http://localhost:8082/");
	});
	it("Try to join a session and fail, then return to the main page and log out",function () {
		cy.url().should("include","/client");
		cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Bli med i økt!");
		cy.get('[data-cy=Language]')
			.find("a")
			.should("have.text","Språk")
			.click();
		cy.get("#en").click();
		cy.get('[data-cy=Language]')
			.find("a")
			.should("have.text","Language");
		cy.get('#JoinRoom > :nth-child(1) > .col-12 > h1').should("have.text","Quick join session!");
		cy.get('[data-cy=joinSession]').type("001");
		cy.get('#JoinRoom > :nth-child(3) > .col-12 > .btn').click();
		cy.get('#SandBox > div > div > h1').should("have.text","Go to sandbox");
		cy.get('#SandBox > div > div > p:nth-child(1) ').should("contain","Practice with different question types.");
		cy.get('#SandBox > div > div > p:nth-child(2) ').should("contain","Play with the graphdrawer to get familiar with the controls.");
		cy.get('#SandBox > div > div >.btn').should("contain","Go");
		cy.get(".navbar-brand").click();
		cy.url().should("equal","http://localhost:8082/");
		cy.get("h1").should("have.text","Homepage");
		cy.get('[data-cy=loginButton] > a > span').should("contain","Anonymous");
		cy.get('[data-cy=loginButton] > a > span').click();
		cy.get('[data-cy=loginButton] > .dropdown-menu > .dropdown-item').should("be.visible").click();
		cy.get(':nth-child(2) > .nav-link').should("have.text","Sign in");
		cy.get('[data-cy=Language]')
			.find("a")
			.should("have.text","Language")
			.click();
		cy.get("#no")
			.should("be.visible")
			.click();
		cy.get('[data-cy=Language]')
			.find("a")
			.should("have.text","Språk");
	});
	it("Test Sandbox",function () {
		cy.url().should("include","/client");
		cy.get('[data-cy=Language]')
			.find("a")
			.should("have.text","Språk").click();
		cy.get("#en").click();
		cy.get('#SandBox > div > div >.btn')
			.should("contain","Go")
			.click();
		cy.get("#solutionTypeInput")
			.select("Text")
			.should("have.value","Text");
		cy.get('#SandBoxGuide > div > h3').should("have.text","Guide");
		for (let i = 1; i <= 4; i++) {
			if (i === 1 || i === 2)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + i + ")").should("contain","text question");
			else if (i === 3)	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + i + ")").should("contain", "write the correct answer into this field");
			else	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + i + ")").should("contain", "solution it will not be case sensitive");
		}

		cy.get("#solutionTypeInput")
			.select("Multiple choice")
			.should("have.value","Multiple choice");
		for (let j = 1; j <= 6; j++) {
			if (j >= 1 && j <= 4) {
				cy.get(".col > .container > .row > :nth-child("+ j+") > .selected")
					.click();
			}
			if (j === 1 || j === 2)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain","multiple choice question");
			else if (j === 3)	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "Click on the boxes that you would like to send as the correct answer.");
			else if (j === 4)	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "which box you have selected for the answer.");
			else if (j === 5)	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "click the \"Answer\" button.");
			else 	cy.get("#GuideInfo .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain" , "only answers with the exact number of boxes selected and the same boxes selected will get a correct answer.");
		}

		cy.get("#solutionTypeInput")
			.select("Shellsort")
			.should("have.value","Shellsort");
		cy.get("#SandBoxSettings")
			.should("visible")
			.find("h3")
			.and("have.text","Settings");
		cy.get("#shellsortStartKValue").should("have.value","4");
		cy.get("#shellsortStartList").should("have.value","4,80,54,23,1,5,7,3,245,43");
		cy.get("#SandBoxGuide > div > h3")
			.should("have.text","Guide")
			.click();
		for (let j = 1; j <= 6; j++) {
			if (j === 1 || j === 2) cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "shellsort question");
			else if (j === 3)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", " When adding a new row, you will have to add the k value for that round of sort and the sorted list for that k value.");
			else if (j === 4)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "copy the row from above and exclude the k value which you need to input.");
			else if (j === 5)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "To sort a row you will have to click on an element");
			else 	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "The solution checker will check that each round of sorting have the correct k value and correct \"sorted list\" for that round.");
		}
		cy.get(':nth-child(2) > .row > :nth-child(1) > .btn')
			.should("have.text","Add new row")
			.click()
			.click();
		cy.get(":nth-child(4).shellsortTableRow ").should("visible");
		cy.get(":nth-child(2) > .btn")
			.should("have.text","Remove last row")
			.click();
		cy.get(":nth-child(4).shellsortTableRow ").should("not.visible");
		cy.get(".mb-1 > :nth-child(2) > .shellsortInput")
			.should("have.value","4")
			.click({ force: true });
		cy.get(".mb-1 > :nth-child(3) > .shellsortInput")
			.should("have.value","80")
			.click(({force: true}));
		cy.get(".mb-1 > :nth-child(2) > .shellsortInput").should("have.value","80");
		cy.get(".mb-1 > :nth-child(3) > .shellsortInput").should("have.value","4");

		cy.get("#solutionTypeInput")
			.select("Mergesort")
			.should("have.value","Mergesort");
		cy.get("#SandBoxSettings")
			.find("h3")
			.should("have.text","Settings");
		cy.get("#SandBoxSettings")
			.find("label")
			.should("have.text","Initial list:");
		cy.get('#mergesortStartList').should("have.value","4,80,54,23,1,5,7,3,245,43");
		cy.get("#canvas").should("visible");
		cy.get('#SandBoxGuide > div > h3')
			.should("have.text","Guide")
			.click();
		for (let j = 1; j <= 8; j++) {
			if (j === 1 || j === 2) cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "mergesort question");
			else if (j === 3)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "select and display possible actions");
			else if (j === 4)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "show how the mergesort algorithm works its way through an unsorted list");
			else if (j === 5)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "pressing the delete button the selected elements will be deleted");
			else if (j === 6)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "pressing move you can now click somewhere in the canvas and the selected list will be moved to that location");
			else if (j === 7)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "take the selected elements from a list and extract them to a sublist");
			else	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", " The mergesort algorithm is set up to check the left side first.");
		}
		cy.get("#solutionTypeInput")
			.select("Quicksort")
			.should("have.value","Quicksort");
		cy.get("#SandBoxSettings")
			.find("h3")
			.should("have.text","Settings");
		cy.get("#SandBoxSettings")
			.find("label")
			.should("have.text","Initial list:");
		cy.get('#quicksortStartList').should("have.value","4,80,54,23,1,5,7,3,245,43");
		cy.get("#canvas").should("visible");
		cy.get('#SandBoxGuide > div > h3')
			.should("have.text","Guide")
			.click();
		for (let j = 1; j <= 10; j++) {
			if (j === 1 || j === 2) cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "quicksort question");
			else if (j === 3)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "display possible actions");
			else if (j === 4)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "show how the quicksort algorithm works its way through an unsorted list.");
			else if (j === 5)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "pivot point should be selected is the meadian element of the first, last and middle element");
			else if (j === 6)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "will be marked so it's easy to spot");
			else if (j === 7)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "pressing the delete button the selected elements will be deleted,");
			else if (j === 8)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "pressing move you can now click somewhere in the canvas and the selected list will be moved to that location");
			else if (j === 9)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "selected elements from a list and extract them to a sublist");
			else	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "The quicksort algorithm is set up to check the left side first");
		}

		cy.get("#solutionTypeInput")
			.select("Tree")
			.should("have.value","Tree");
		cy.get("#SandBoxSettings").should("not.visible","Settings");
		cy.get('#SandBoxGuide > div > h3').should("have.text","Guide");
		cy.get("#canvas")
			.should("visible")
			.trigger("mousedown", {offsetX: 100, offsetY: 100})
			.trigger("mousedown", {offsetX: 200, offsetY: 200})
			.trigger("mousedown", {offsetX: 400, offsetY: 300})
			.trigger("mousedown", {offsetX: 400, offsetY: 580})		//join button
			.trigger("mousedown", {offsetX: 100, offsetY: 100})
			.trigger("mouseup", {offsetX: 200, offsetY: 200})	//join the two nodes created
			.trigger("mousedown", {offsetX: 300, offsetY: 580})	//move button
			.trigger("mousedown", {offsetX: 400, offsetY: 300})
			.trigger("mousemove", {offsetX: 450,offsetY: 350})	//move cursor
			.trigger("mouseup", {offsetX: 450, offsetY: 350})	//release cursor to finish moving the node
			.trigger("mousedown", {offsetX: 500, offsetY: 580})	//edit button
			.trigger("mousedown", {offsetX: 200, offsetY: 580})	//remove button
			.trigger("mousedown", {offsetX: 400, offsetY: 300});

		for (let j = 1; j <= 9; j++) {
			if (j === 1)  cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "tree related question");
			else if (j === 2)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "draw the resulting binary tree");
			else if (j === 3)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "Whenever you should add or remove the nodes from the tree should be specified in the description");
			else if (j === 4)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "The GraphDrawer for trees have 5 different command options");
			else if (j === 5)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "using the \"Add\" command");
			else if (j === 6)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "using the \"Remove\" command");
			else if (j === 7)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "using the \"Move\" command");
			else if (j === 8)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "using the \"Join\" command");
			else	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "using the \"Edit\" command");
		}

		cy.get("#solutionTypeInput")
			.select("Dijkstra")
			.should("have.value","Dijkstra");
		cy.get("#SandBoxSettings").should("not.visible","Settings");
		cy.get('#SandBoxGuide > div > h3').should("have.text","Guide");
		cy.get("#canvas").should("visible");

		for (let j = 1; j <= 3; j++) {
			if (j === 1)  cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "guide for using the GraphDrawer on questions about the Dijkstra algorithm:");
			else if(j === 2)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain","You need to show how the algorithm finds the path from the start");
			else	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "keep the mouse button pressed down, move the cursor over the other node and release the button.");
		}

		cy.get("#solutionTypeInput")
			.select("Python")
			.should("have.value","Python");
		cy.get("#SandBoxGuide > div > h3")
			.should("have.text","Guide")
			.click();
		cy.get("#canvas").should("visible");
		cy.get("#GuideInfo").should("visible");
		cy.get("#pythonCodeInput")
			.should("visible")
			.type("c = 5");
		cy.get('#SandBoxSettings').find(".btn")
			.should("have.text","Parse code")
			.click();

		for (let j = 1; j <= 5; j++) {
			if (j === 1)  cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "guide for using the GraphDrawer on questions about Python code:");
			else if (j === 2)	cy.get("#GuideInfo > .jumbotron > .row .col > :nth-child(" + j + ")").should("contain","map of how the objects and variables reference eachother.");
			else if (j === 3)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "To add a variable click the \"Add_Variable\" button and enter the variable name in the prompt. To add an object use the \"Add_Object\" button. When you click a prompt will ask you for the type. If you select Number, String or Boolean");
			else if (j === 4)	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "relationship you need to \"Join\" the nodes together. Variables are linked from the variable to the object.");
			else 	cy.get("#GuideInfo > .jumbotron > .row > .col > :nth-child(" + j + ")").should("contain", "settings menu you can write your own code, and then press the parse button. This will parse the code for you, and add any classes to the list of object types.");
		}
	})
});
