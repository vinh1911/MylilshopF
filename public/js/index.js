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


function logoutClick(){
  firebase.auth().signOut();
}

// Add products
var rootRef = firebase.database();
var itemCode = document.getElementById("itemCode");
var itemName = document.getElementById("itemName");
var itemQuantity = document.getElementById("itemQuantity");
var itemPrice = document.getElementById("itemPrice");
var itemCost = document.getElementById("itemCost");

function submitClick() {
	var iCode = itemCode.value;
	var iName = itemName.value;
	var iPrice = itemPrice.value;
	var iQuantity = itemQuantity.value;
	var iCost = itemCost.value;
	rootRef.ref('Inventory/' + iCode).set({
	Code: iCode,
    Name: iName,
	Price: iPrice,
	Cost: iCost,
	Quantity: iQuantity
  });
}
// Display products
var invRef = rootRef.ref().child("Inventory");

invRef.on("child_added", snap => {
	var code = snap.child("Code").val();
	var name = snap.child("Name").val();
	var price = snap.child("Price").val();
	var cost = snap.child("Cost").val();
	var quantity = snap.child("Quantity").val();
	$("#table_body").append("<tr><td>" + code + "</td><td>" + name + "</td><td>" + cost +"</td><td>"+price+"</td><td>"+quantity+"</td><tr>");
});
var sum = 0;
function bcsubmit() {
  var key = document.getElementById('barcode').value;
  var quantityStr = document.getElementById('quantitys').value;

  invRef.child(key).on("value", snap => {
    var name = snap.child("Name").val();
    var price = snap.child("Price").val();
	var subtotal = price*quantityStr;
	sum = sum + subtotal;
    $("#bill").append("<tr><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' id="+key+" value="+subtotal+">D</button></tr>");
	document.getElementById('total').innerHTML = sum;
});
}

function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum=0;
	document.getElementById('total').innerHTML = sum;
}