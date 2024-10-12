var js_script = $('script[src*=subscribe]');
var eventId = js_script.attr('eventId');  
var going = js_script.attr('going');  
var attend = js_script.attr('attend');  
// console.log("MyEvent")
console.log(eventId)
console.log(attend);
console.log(going)
// let eventId = MyEvent._id;
let userId = user._id;
// the localURL variable is in .env file and is just local and it won't be added to the deployed site
// so the serverURL is added to the deployed site so it will be taken
let url = serverURL;
// let url = localURL;

if (user) {
  url = "/events/" + eventId + "/" + userId + "/";
  
  let subscribe = false;
  $(function () {
    $("#subscribe").on("click", function () {
      // the user is already subscribed
      if ($(this).hasClass("subscribed")) {
        // $(this).text("Assister");
        $(this).text(attend);
      } else {
        // $(this).text("Aller");
        $(this).text(going);
        subscribe = true;
      }
      $(this).toggleClass("subscribed");
      console.log(url)
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
   
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
}
