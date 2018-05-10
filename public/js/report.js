var ShowRef = rootRef.ref().child("Transaction");
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
//Get Item
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
