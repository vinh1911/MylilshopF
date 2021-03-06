//The process of adding new bought products into the database.
var items;
var sum = 0;
var row=0;

//This function will be performed after the add items function.
//In the add items function, the barcode, price, and name of the new item will be assigned.
//After that, we will use those details to add the quantity to the database.
//By this method, we can assign many quantity of many items at the same time.
function bcsubmit() {
  var key = document.getElementById('barcode').value;
  var quantityStr = parseInt(document.getElementById('quantitys').value);
  var iShop = document.getElementById("ShopID").value;
  invRef.child(key).once("value", snap => {
    var name = snap.child("Name").val();
    var price = parseInt(snap.child("Cost").val());
  	var i,code,count=0;
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
			if(row === count-1){
				$('#bill').append("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}else{
				$('#bill > thead > tr').eq(count-1).after("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}
			row++;
  	}
  });
}
//

//Delete the chosen row by its ID on the table.
function deleteRow(id){
  $('#bill-'+id).remove();
  row--;
  sum = 0;
}
//


//Commit the process.
//The new quantity of the new items will be saved on the database.
//The date of the import process will also be saved for later review.
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
    qLista.push(quantity);
		subtotal = parseInt($("#bill tr:eq("+i+") td:eq("+3+")").html());
    qListv.push(-subtotal);
    $('#modal_body').append("<tr><td>"+code+"</td><td>" + name + "</td><td>"+quantity+"</td><td>"+subtotal+"</td></tr>");
		sum = sum + subtotal;
	}
	items = x-1;
  document.getElementById('total').innerHTML = sum;
  $('#modal_body').append("<tr><td>Total:</td><td>"+sum+"</td><td></td><td></td></tr>");
 
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
//

//Delete all the data in the table.
function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum = 0;
	row = 0;
}
