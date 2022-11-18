let eventId = MyEvent._id;
let userId = user._id;
// the localURL variable is in .env file and is just local and it won't be added to the deployed site
// so the serverURL is added to the deployed site so it will be taken
let url = localURL || serverURL;
// let url = localURL;
console.log("URL:", url);
if (user) {
  url = url + "/events/" + eventId + "/" + userId + "/";
  console.log("Sending... to:", url);
  let subscribe = false;
  $(function () {
    $("#subscribe").on("click", function () {
      console.log($(this).hasClass("subscribed"))
      // the user is already subscribed
      if ($(this).hasClass("subscribed")) {
        $(this).text("Attend");
      } else {
        $(this).text("Going");
        subscribe = true;
      }
      $(this).toggleClass("subscribed");

      fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscribe,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
}
