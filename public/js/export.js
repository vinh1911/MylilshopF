//The process of selling products
var items;
var sum = 0;
var row=0;

//Enter or Scan the barcode. Fetch the details of the product by using it ID.
function bcsubmit() {
  var key = document.getElementById('barcode').value;//Take the barcode value from the textbox.
  var quantityStr = parseInt(document.getElementById('quantitys').value);//Take the quantity of the chosen item from the textbox.
  var iShop = document.getElementById("ShopID").value;//Take the ID of the shop.
invRef.child(key).once("value", snap => {
    var name = snap.child("Name").val();//Fetch the name of the chosen item from the database
    var price = parseInt(snap.child("Price").val());//Fetch the price of the chosen item from the database
	var quantityxx = parseInt(snap.child("Shop").child(iShop).val());//Fetch the available quantity of the chosen item from the database
	var i,code,count=0;
	//Check if the following item already exists in the table or not. If it already exists, marks its position. 
	for (i=1 ; i <= row ; i++){
		code = document.getElementById("bill-"+i+"").getAttribute("name");
		if (code===key){
			count = i;
		}
	}
	//Start to display the item on the table.
	if (count == 0)//The item is not in the table
	{
		if(quantityxx >= quantityStr)//Check if the quantity in the stock is larger than the required quantity of needed item.
		{
			var subtotal = price*quantityStr;
			row++;
			$("#bill").append("<tr name="+key+" id=bill-"+row+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+row+");'>x</button></tr>");//Display the item in the table
		}else{
		alert("Error!");//If the quantity in the stock is not enough, the system will show the error warning.
		}
	} else {
		//The item is already in the table. 
		var oldquantity = parseInt($("#bill tr:eq("+count+") td:eq("+2+")").html());
		quantityStr = quantityStr + oldquantity;//Sum up the old quantity with the new one
		if(quantityxx >= quantityStr)//Check if the total quantity is smaller than the quantity in the stock.
		{
			var subtotal = price*quantityStr;
			var output = parseInt($("#bill tr:eq("+count+") td:eq("+3+")").html());
			deleteRow(count);//Delete the shown row of the item in order to append a new one with the total quantity in that position.
			if(row === count-1){//If the deleted row is the last row of the table, we append the new row to the last row of the table.
				$('#bill').append("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}else{//If the deleted row is not the last row of the table, we add the new row to the old location.
				$('#bill > thead > tr').eq(count-1).after("<tr name="+key+" id=bill-"+count+"><td>" + name + "</td><td>"+price+"</td><td>"+ quantityStr +"</td><td>"+subtotal+"</td><td><button type='button' class='btn btn-primary btn-sm' onclick='deleteRow("+count+");'>x</button></tr>");
			}
			row++;
		}else{
		alert("Error!");//If the quantity in the stock is not enough, the system will show the error warning.
		}
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

//Commit the transaction to the database after the customer confirms it.
//The quantity of the items in the stock will be updated
//The details of the transaction such as date and income of each sold item will be saved for later review.
//After the commitment, there will appear a table with all the details on it.
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
//Delete all the data in the table.
function deleteFun(){
	var x = document.getElementById("bill").rows.length;
    for (i=1;i<x;i++){
        document.getElementById("bill").deleteRow(1);
    }
	sum = 0;
	row = 0;
}
