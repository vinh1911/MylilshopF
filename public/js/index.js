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
    var user = firebase.auth().currentUser.uid;
    console.log(user);
    var uroot = firebase.database().ref().child("Users");
    uroot.child(user).on("value", snap => {
      var currentshop = snap.child("ShopID").val();
      console.log(currentshop);
      document.getElementById("ShopID").value=currentshop;
      invRef.on("child_added", snap => {
      	var code = snap.child("Code").val();
      	var name = snap.child("Name").val();
      	var price = snap.child("Price").val();
      	var cost = snap.child("Cost").val();
      	var quantity = snap.child("Shop").child(currentshop).val();
      	$("#table_body").append("<tr><td>" + code + "</td><td>" + name + "</td><td>" + cost +"</td><td>"+price+"</td><td>"+quantity+"</td><tr>");
      });
    });
  }
  else {
    window.location.href = "login.html";
  }
});

function createUser(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  var userName = document.getElementById("name_field").value;
  var userShop = document.getElementById("shop_field").value;
  var userRole = document.getElementById("role_field").value;
  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function(user) {
    var root = firebase.database().ref();
    var uid = user.uid;
    var postData = {
      Email: userEmail,
      Name: userName,
    	ShopID: userShop,
    	Role: userRole
   };
   root.child("Users").child(uid).set(postData);
  });
}

function logoutClick(){
  firebase.auth().signOut();
}

function usercheck(){
  var user = firebase.auth().currentUser;
  console.log(user.displayName);
  console.log(user.email);
  console.log(user.uid);
}


// Add products


var invRef = firebase.database().ref().child("Items");
function submitClick() {
  var iCode = document.getElementById("barcode").value;
  var iName = document.getElementById("itemName").value;
  var iQuantity = document.getElementById("itemQuantity").value;
  var iPrice = document.getElementById("itemPrice").value;
  var iCost = document.getElementById("itemCost").value;
  var iShop = document.getElementById("ShopID").value;
	invRef.child(iCode).update({
	  Code: iCode,
    Name: iName,
  	Price: iPrice,
  	Cost: iCost
  });
  invRef.child(iCode).child("Shop").child(iShop).set(iQuantity);
}
// Display products


var sum = 0;
var row=0;
function bcsubmit() {
  var key = document.getElementById('barcode').value;
  var quantityStr = document.getElementById('quantitys').value;

invRef.child(key).on("value", snap => {
    var name = snap.child("Name").val();
    var price = snap.child("Price").val();
	var subtotal = price*quantityStr;
	sum = sum + subtotal;
  row++;
    $("#bill").append("<tr id=bill-"+row+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+row+");'>x</button></tr>");
	document.getElementById('total').innerHTML = sum;
});
}

function deleteRow(id){
  $('#bill-'+id).remove();
}

function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum=0;
	document.getElementById('total').innerHTML = sum;
}
