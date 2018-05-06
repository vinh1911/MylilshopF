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


//Login check
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

// Add products
var rootRef = firebase.database();
var itemCode = document.getElementById("itemCode");
var itemName = document.getElementById("itemName");
var itemQuantity = document.getElementById("itemQuantity");
var itemPrice = document.getElementById("itemPrice");
function submitClick() {
	var iCode = itemCode.value;
	var iName = itemName.value;
	var iPrice = itemPrice.value;
	var iQuantity = itemQuantity.value;
	rootRef.ref('Inventory/' + iCode).set({
	Code: iCode,
    Name: iName,
	Price: iPrice,
	Quantity: iQuantity
  });
}

// Display products
var invRef = rootRef.ref().child("Inventory");

invRef.on("child_added", snap => {
	var code = snap.child("Code").val();
	var name = snap.child("Name").val();
	var price = snap.child("Price").val();
	var quantity = snap.child("Quantity").val();
	
	$("#table_body").append("<tr><td>" + code + "</td><td>" + name + "</td><td>" + price +"</td><td>"+quantity+"</td><tr>");
});