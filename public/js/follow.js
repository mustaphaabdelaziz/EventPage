// those are coming from the profile page
let follwedUserId = followedUser._id;
let userId = user._id;
// the localURL variable is in .env file and is just local and it won't be added to the deployed site
// so the serverURL is added to the deployed site so it will be taken
let url = localURL || serverURL;
// let url = localURL;


if (user) {
  
  if (followedUser.userType === "user") {
    url = url + "/user/" + userId + "/follow";
    
  } else {
    url = url + "/company/" + userId + "/follow";

  }
  let follow = false;
  $(function () {
    $("#follow").on("click", function () {
      if ($(this).text() === "Follow") {
        follow = true;
     
        $(this).text("Following");
      } else {

        follow = false;
        $(this).text("Follow");
      }
      axios
        .post(url, {
          follow,
          userId,
          follwedUserId,
        })
        .then(function (response) {
      
          $("#followers").text(response.data.nbrFollowers);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  });
}
