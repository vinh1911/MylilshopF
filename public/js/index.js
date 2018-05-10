firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var uroot = firebase.database().ref().child("Users");
    uroot.child(user.uid).on("value", snap => {
      var currentshop = snap.child("ShopID").val();
      console.log(currentshop);
      var page = window.location.pathname.split("/").pop();
      console.log( page );
      var pageArr = ["items.html","home.html"];
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
  var iQuantity = document.getElementById("itemQuantity").value;
  var iPrice = document.getElementById("itemPrice").value;
  var iCost = document.getElementById("itemCost").value;
  var iShop = document.getElementById("ShopID").value;
	invRef.child(iCode).update({
	  Code: iCode,
    Name: iName,
  	Price: parseInt(iPrice),
  	Cost: parseInt(iCost)
  });
  invRef.child(iCode).child("Shop").child(iShop).set(parseInt(iQuantity));
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
	for (i=1 ; i <= row ; i++){
		code = document.getElementById("bill-"+i+"").getAttribute("name");
		if (code===key){
			count = i;
		}
	}
	if (count == 0)
	{
		if(quantityxx >= quantityStr)
		{
			var subtotal = price*quantityStr;
			row++;
			$("#bill").append("<tr name="+key+" id=bill-"+row+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+row+");'>x</button></tr>");
		}else{
		alert("Error!");
		}
	} else {
		var oldquantity = parseInt($("#bill tr:eq("+count+") td:eq("+2+")").html());
		quantityStr = quantityStr + oldquantity;
		if(quantityxx >= quantityStr)
		{
			var subtotal = price*quantityStr;
			var output = parseInt($("#bill tr:eq("+count+") td:eq("+3+")").html());
			deleteRow(count);
			if(row === count-1){
				$('#bill').append("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}else{
				$('#bill > thead > tr').eq(count-1).after("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}
			row++;
		}else{
		alert("Error!");
		}
	}
});
}

function deleteRow(id){
  $('#bill-'+id).remove();
  row--;
  sum = 0;
}

function commit(){
  var iShop = document.getElementById("ShopID").value;
  var qListi = [];
	var qLista = [];
	var qListv = [];
	var i,  code, name , subtotal, quantity;
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var DateId = year*10000+month*100+day;
	console.log(DateId);
	var x = document.getElementById("bill").rows.length;
	for (i = 1; i < x; i++)
	{
		code = document.getElementById("bill-"+i+"").getAttribute("name");
    qListi.push(code);
		name = $("#bill tr:eq("+i+") td:eq("+0+")").html();
		quantity = parseInt($("#bill tr:eq("+i+") td:eq("+2+")").html());
    qLista.push(-quantity);
		subtotal = parseInt($("#bill tr:eq("+i+") td:eq("+3+")").html());
    qListv.push(subtotal);
		sum = sum + subtotal;
	}
	items = x-1;
  document.getElementById('total').innerHTML = sum;
  alert("The total amount : " + sum +" $"+"\nThe number of sold items: " + items);
  var TransRef = rootRef.ref().child("Transaction");
  var qId=TransRef.push();
  qId.set({
			Count: items,
      Shop: iShop,
			Time: DateId,
			Item:{
			}
		});
  for(i=0;i<=items;i++ ){
	qId.child("Item/"+(i+1)).update({
			Item: qListi[i],
			Amount: qLista[i],
			Value: qListv[i]});
  	rootRef.ref('Items/' + qListi[i] + '/Shop/'+iShop).transaction(function(currentValue) {
  			return (currentValue||0) + parseInt(qLista[i]); // +/- depend on manager/employee
  	});
	}
}

function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum = 0;
	row = 0;
}

var ShowRef = rootRef.ref().child("Transaction");
function createReport() {
  var from = document.getElementById("from_field").value;
  var to = document.getElementById("to_field").value;
	ShowRef.orderByChild("Time").startAt(parseInt(from)).endAt(parseInt(to)).once('value',gotItem)
}
//Get Item
function gotItem(data){
	//console.log(data.val());
	var Trans = data.val();
	var keys = Object.keys(Trans);
	//console.log(keys);
	//for loop get Key Array
	for (var i=0;i<keys.length;i++){
		var k = keys[i];
    var iShop = Trans[k].Shop;
		var item = Trans[k].Item;
    var date = parseInt(Trans[k].Time);
    var D = date%100;
    var M = (date-D) % 10000/100;
    var Y = (date-M*100-D)/10000;
		//console.log(item);
		var count = Trans[k].Count;
		//for loop append table
		for(var j=1;j<=count;j++){
			var stuff = item[j];
			console.log(stuff);
			var BarCode=stuff.Item;
			var Amount=stuff.Amount;
			var Value = stuff.Value;
			$("#report_body").append("<tr><td>"+k+"</td><td>"+iShop+"</td><td>"+D+"/"+M+"/"+Y+"</td><td>"+BarCode+"</td><td>"+Amount+"</td><td>"+Value+"</td></tr>");
		}
	}
}
