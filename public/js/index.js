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

var items;
var sum = 0;
var row=0;
function bcsubmit() {
  var key = document.getElementById('barcode').value;
  var quantityStr = parseInt(document.getElementById('quantitys').value);
  var iShop = document.getElementById("ShopID").value;
invRef.child(key).on("value", snap => {
    var name = snap.child("Name").val();
    var price = parseInt(snap.child("Price").val());
	var quantityxx = parseInt(snap.child("Shop").child(iShop).val());
	var i,code,count=0;	
	if (quantityxx >= quantityStr){
		for (i=1 ; i <= row ; i++){
			code = document.getElementById("bill-"+i+"").getAttribute("name");
			if (code===key){
				count = i;
			}
		}
		if (count == 0)	
		{
			var subtotal = price*quantityStr;
			row++;
			$("#bill").append("<tr name="+key+" id=bill-"+row+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+row+");'>x</button></tr>");

		} else {
			var oldquantity = parseInt($("#bill tr:eq("+count+") td:eq("+2+")").html());
			quantityStr = quantityStr + oldquantity;
			var subtotal = price*quantityStr;
			var output = parseInt($("#bill tr:eq("+count+") td:eq("+3+")").html());
			deleteRow(count);
			row++;
			$('#bill > thead > tr').eq(count-1).after("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+row+");'>x</button></tr>");
		}
	}else{
		alert("Error! Out of stock!");
	}
});
}

function deleteRow(id){ 
  var output = parseInt($("#bill tr:eq("+id+") td:eq("+3+")").html());
  $('#bill-'+id).remove(); 
  row--;
  sum = 0;
}

function commit(){
	var i,  code, name , subtotal, quantity;
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var x = document.getElementById("bill").rows.length;
	for (i = 1; i < x; i++)
	{
		code = document.getElementById("bill-"+i+"").getAttribute("name");
		name = $("#bill tr:eq("+i+") td:eq("+0+")").html();
		quantity = parseInt($("#bill tr:eq("+i+") td:eq("+2+")").html());
		subtotal = parseInt($("#bill tr:eq("+i+") td:eq("+3+")").html());
		sum = sum + subtotal;
	}
	items = x-1;
	alert("The total amount : " + sum +" $"+"\nThe number of sold items: " + items);
}

function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum = 0;
	row = 0;
}
