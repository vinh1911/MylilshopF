firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uroot = firebase.database().ref().child("Users");
    uroot.child(user.uid).on("value", snap => {
      var currentshop = snap.child("ShopID").val();
      console.log(currentshop);
      var page = window.location.pathname.split("/").pop();
      console.log( page );
      var pageArr = ["items.html","home.html","additem.html"];
      if(pageArr.indexOf(page) > -1){
        document.getElementById("ShopID").value=currentshop;
        invRef.on("child_added", snap => {
        	var code = snap.child("Code").val();
        	var name = snap.child("Name").val();
        	var price = snap.child("Price").val();
        	var cost = snap.child("Cost").val();
        	var quantity = snap.child("Shop").child(currentshop).val();
        	$("#table_body").append("<tr><td>" + code + "</td><td>" + name + "</td><td>" + cost +"</td><td>"+price+"</td><td>"+quantity+"</td><td><button class='btn btn-primary btn-sm' onclick='fillcode("+code+");'>←</button></td></tr>");
        });
      }
      else if (page == "addUser.html"){
        uroot.on("child_added", snap => {
          $("#user_body").append("<tr><td>" + snap.val().Name + "</td><td>" + snap.val().Email + "</td><td>" + snap.val().ShopID +"</td><td>"+snap.val().Role+"</td></tr>");
        });
      }
      else if (page == "addShop.html"){
        var sroot = firebase.database().ref().child("Shops");
        sroot.on("child_added", snap => {
          $("#shop_body").append("<tr id=de_"+snap.key+"><td>" + snap.key + "</td><td>" + snap.val() + "</td></tr>");
        });
      }
    });
  }
});


function logoutClick(){
  firebase.auth().signOut();
}

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


function createShop(){
  var shopId = document.getElementById("shop_field").value;
  var shopAddress = document.getElementById("address_field").value;
  var root = firebase.database().ref();
  var shopRef = firebase.database().ref().child("Shops");
  shopRef.child(shopId).set(shopAddress);
}
// Add products

var rootRef = firebase.database();
var invRef = rootRef.ref().child("Items");
function submitClick() {
  var iCode = document.getElementById("barcode").value;
  var iName = document.getElementById("itemName").value;
  var iPrice = document.getElementById("itemPrice").value;
  var iCost = document.getElementById("itemCost").value;
	invRef.child(iCode).update({
	  Code: iCode,
    Name: iName,
  	Price: parseInt(iPrice),
  	Cost: parseInt(iCost)
  });
}
function deleteClick() {
  var iCode = document.getElementById("barcode").value;
	invRef.child(iCode).remove();
}
