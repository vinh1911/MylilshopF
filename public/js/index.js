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
	  
  }
  else {
    window.location.href = "login.html";
  }
});


function logout(){
  firebase.auth().signOut();
}


var database = firebase.database();
var itemCode = document.getElementById("itemCode");
var itemName = document.getElementById("itemName");
var itemQuantity = document.getElementById("itemQuantity");
var itemPrice = document.getElementById("itemCode");
function submitClick() {
	var iCode = itemCode.value;
	var iName = itemName.value;
	var iPrice = itemPrice.value;
	var iQuantity = itemQuantity.value;
  firebase.database().ref('Inventory/' + iCode).set({
    Name: iName,
	Price: iPrice,
	Quantity: iQuantity
  });
}

