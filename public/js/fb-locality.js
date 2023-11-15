// Add the Facebook SDK for Javascript -->
(function (d, s, id) {
	var js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
const fwToken = JSON.parse(
	decodeURIComponent(document.cookie).split(";")[1].split(" userAuthLocator=").splice(1)
).token;
let params = new UrlSearchParams(window.location.search);
const localityID = params.locality_id;
				fetch("/api/v1/users/fb", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + fwToken,
					},
					body: JSON.stringify(aresp),
				}).then(() => {
					window.location.href = "/locality/" + localityID;
				});
window.fbAsyncInit = function () {
	// <!-- Initialize the SDK with your app and the Graph API version for your app -->
	FB.init({
		appId: "${appId}",
		xfbml: true,
		version: "v18.0",
	});
	//<!-- If you are logged in, automatically get your name and email adress, your public profile information -->
	FB.login(
		function (response) {
			if (response.authResponse) {
				console.log(JSON.stringify(response, null, 2));
				console.log("Welcome!  Fetching your information.... ");
				let aresp = response.authResponse;
				aresp.fwLocalityID = localityID;
				fetch("/api/v1/users/fb", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + fwToken,
					},
					body: JSON.stringify(aresp),
				}).then(() => {
					window.location.href = "/locality/" + localityID;
				});
			} else {
				// <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
				console.log("User cancelled login or did not fully authorize.");
			}
		},
		{
			scope: [
				"public_profile",
				"email",
				"pages_manage_posts",
				"pages_manage_metadata",
				"pages_read_engagement",
				"pages_read_user_content",
				"pages_show_list",
			].join(","),
		}
	);
};
