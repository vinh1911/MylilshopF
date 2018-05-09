// Initialize Firebase
var config = {
  apiKey: "AIzaSyCGMziWzVej0cl-p2UxxTVUcwk3gZ8jYpA",
  authDomain: "mylilshopf.firebaseapp.com",
  databaseURL: "https://mylilshopf.firebaseio.com",
  projectId: "mylilshopf",
  storageBucket: "mylilshopf.appspot.com",
  messagingSenderId: "28816905891"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uroot = firebase.database().ref().child("Users");
    uroot.child(user.uid).on("value", snap => {
      var currentRole = snap.child("Role").val();
      console.log(currentRole);
      if (currentRole == "Manager"){}
      else { window.location.href = "home.html";}
    });
  }
  else { window.location.href = "login.html";}
});
