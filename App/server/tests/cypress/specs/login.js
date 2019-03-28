
describe("Testing Page login functionality",function () {
	//STEP 1 Start the Server!
	before(function () {
		cy.clearCookies();
	});
	beforeEach(function () {
		cy.visit("localhost:8081");
	});
	it("Login as an anonymous user",function () {
		cy.get(':nth-child(2) > .nav-link').click();
		cy.url().should("include","/login");
		//cy.pause();
		cy.get("#anonymousButton").click();
		cy.get("#loginButton").click();
		cy.url().should("include","/client");
		cy.get('#__BVID__11__BV_button_').click();
		//cy.get('#__BVID__11__BV_button_ > span').should("include","Anonymous"); //does not work
		cy.get('#__BVID__11 > .dropdown-menu > .dropdown-item').click();
		cy.url().should("equal","http://localhost:8081/");
	});
	/*it("Login using a Feide user",function () {
		cy.get(":nth-child(2) > .nav-link").click();
		cy.url().should("include","/login");
		//cy.get("#test").click();
		//cy.pause();
		cy.get("#feideButton").click();
		cy.xpath("(.//*[normalize-space(text()) and normalize-space(.)='For å kunne logge inn med Feide så må du akseptere at vi bruker cookies og lagrer data under!'])[1]/following::label[1]").click();
		//cy.get("#loginButton").click();
		//make a post request in order to validate user.
		cy.request({
			method: "POST",
			url:"/login/feide",
			auth: {"user": "frank_foreleser", "pass": "6yhn","sendImmediately": false},
			responseTimeOut: 60000
		},function (res) {
			console.log(res);
		});
		//cy.visit("https://auth.dataporten.no/accountchooser?request=%7B%22return%22%3A%22https%3A%5C%2F%5C%2Fauth.dataporten.no%5C%2Foauth%5C%2Fauthorization%3FissuerHost%3Dhttps%253A%252F%252Fauth.dataporten.no%252F%26client_id%3De4de58d1-c318-43ec-9ccc-5ad63cdda550%26client_secret%3D87370fb0-219c-48e9-b07f-a12d5943be56%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A8081%252Flogin%252Fcallback%252Ffeide%26scope%3Dlongterm%2520openid%2520profile%2520userid-feide%26response_type%3Dcode%22%2C%22clientid%22%3A%22e4de58d1-c318-43ec-9ccc-5ad63cdda550%22%7D");
		//cy.url().should("equal","https://auth.dataporten.no/accountchooser?request=%7B%22return%22%3A%22https%3A%5C%2F%5C%2Fauth.dataporten.no%5C%2Foauth%5C%2Fauthorization%3FissuerHost%3Dhttps%253A%252F%252Fauth.dataporten.no%252F%26client_id%3De4de58d1-c318-43ec-9ccc-5ad63cdda550%26client_secret%3D87370fb0-219c-48e9-b07f-a12d5943be56%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A8081%252Flogin%252Fcallback%252Ffeide%26scope%3Dlongterm%2520openid%2520profile%2520userid-feide%26response_type%3Dcode%22%2C%22clientid%22%3A%22e4de58d1-c318-43ec-9ccc-5ad63cdda550%22%7D");
		cy.pause();

	});*/
});