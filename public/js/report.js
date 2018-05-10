var ShowRef = rootRef.ref().child("Transaction");

//This Function is used to creat A report From day 'from' to day 'to' with following format: yyyymmdd,
//When the button pressed, this function will call, create a reference to Transaction child and call function child
//"Time" is a child in the database which contain the time when the transaction is created
//"Time" is used to order the table chronologically, which will be create later with function "gotItem"
function createReport() {
  var  yearOne, yearTwo, monthOne, monthTwo, dayOne, dayTwo;
   yearOne = parseInt(document.getElementById('from_year').value);
   yearTwo = parseInt(document.getElementById('to_year').value);
   monthOne = parseInt(document.getElementById('from_month').value);
   monthTwo = parseInt(document.getElementById('to_month').value);
   dayOne = parseInt(document.getElementById('from_date').value);
   dayTwo = parseInt(document.getElementById('to_date').value);

  var fromX =  yearOne*10000+monthOne*100+dayOne;
  var toY = yearTwo*10000+monthTwo*100+dayTwo;

	ShowRef.orderByChild("Time").startAt(parseInt(fromX)).endAt(parseInt(toY)).once('value',gotItem)
}

//Get Item this Function is used to take the key value, which is a pushed random unique key then show it out on the table
//"Trans" is the array contain all content of the the "Transaction" tree
//"keys" is the array contain all key value of in content directly under "Transaction" tree, these key value is Transaction Id (Unique key) created when a Transaction created
//The 1st For loop is to check each content of Transaction under each Transaction Id
//"k" is the value inside "keys[i]
//"iShop", "item", "date" is the Attribute of each transaction, respectively is the Shop transaction belong to, the Item list array, the time Transaction is created
//"D","M","Y" is Day, Month, Year calculated from "date"
//"Count" is number of item in the item list
//The 2nd For loop is take all the Item attribute under the Item list, including:
//"stuff" is the element number j in "item" array
//"BarCode" is the item code
//"Amount" is the quantity of that item import/export in the Transaction
//"Value" is the total monetary value of the item
//Those info will be append to the table with id "#report_body"

function gotItem(data){

	var Trans = data.val();
	var keys = Object.keys(Trans);

	//for loop get Key Array
	for (var i=0;i<keys.length;i++){
		var k = keys[i];
    var iShop = Trans[k].Shop;
		var item = Trans[k].Item;
    var date = parseInt(Trans[k].Time);
    var D = date%100;
    var M = (date-D) % 10000/100;
    var Y = (date-M*100-D)/10000;

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
