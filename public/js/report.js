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
