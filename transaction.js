//Transaction Update onlick
function submitClick2() {
	//ShopId, Day, Month, Year taken in by other code
	var qShop = 1; 
	var D = 10;
	var M = 6;
	var Y = 1945;
	//Push
	var TransRef = rootRef.ref().child("Transaction/"+Y+"/"+M+"/"+D);
	var qId=TransRef.push();
	//Row: Number of Rows, qListi: Array item ,qLista: Array amount
	var i;
	var row=2;
	var qListi = [];
	var qLista = [];
	
	//Push value read into Array
	//For loop needed
	//for(i=0;i<row;i++){
	//		qLista.push(...); 		... : Location in Table
	//}
	qListi.push("BN0001");
	qListi.push("AA0001");
	qLista.push(3);
	qLista.push(22); 
	
	if(qShop){
		qId.set({	
			Shop: qShop,
			item:{
				
			}
		});
		
		for(i=0;i<=row;i++ ){
			qId.child("Item").update({
				[qListi[i]]: qLista[i]});
		}
	}
	else alert("Wrong")
}
