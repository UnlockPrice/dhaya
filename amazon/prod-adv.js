var aws = require("./lib/aws");
var amazon_savespec = require('./amazon_savespec.js');
var amazon_scrap = require('./amazon_scrap.js');
prodAdv = aws.createProdAdvClient("AKIAIZOCUSPJGRUD65JQ", "TtHt1/X6ePJcvytO1839luPxZmNISoUsP9jmNi7X", "unloc-21");
var priceObj = {TotalResults:0,MinPrice:0,MaxPrice:-1,PriceRange:100,ItemPage:1}
var totalparsedResults=0;
execute(priceObj,true);
var minResponseLimit = 70;
var productList=[];
var productCounter=0; 
var finalTotalResults = 0;
var d = new Date();
var startTime = d.getTime();
//console.log('finalTotalResults:'+finalTotalResults);
amazon_savespec.initialize();
var mysql      = require('mysql');
	var pool      =    mysql.createPool({
		connectionLimit : 500, //important
		host     : 'localhost',  
		 user     : 'root',  
		 password : '',  
		database : 'sepp2015',
		multipleStatements:true
	});

function execute(obj,skipParsing){
	var searchObj = {};
	searchObj.SearchIndex="Electronics";
	searchObj.BrowseNode = "1375424031";
	//searchObj.ItemId='B00NEFZW9W';
	//searchObj.IdType='ASIN';
	searchObj.ResponseGroup="ItemAttributes,OfferSummary,Images";
	searchObj.MinimumPrice=obj.MinPrice*100;
	searchObj.ItemPage=obj.ItemPage;
	if(obj.MaxPrice>0){
		searchObj.MaximumPrice=obj.MaxPrice*100;
	}
	prodAdv.call("ItemSearch", searchObj, function(err, result) {
	   // console.log('working fine');
	   // return;
	  obj.TotalResults = result.ItemSearchResponse.Items[0].TotalResults[0];
	  //console.log('totresult'+obj.TotalResults+"maxprice:"+obj.MaxPrice);
	  if(!skipParsing){
		  if(getPriceRange(obj)){
			parseCurrentResponse(result,obj);
		  }else{
			execute(obj,false);
		  }
	  }else{
		  finalTotalResults = obj.TotalResults;
		  obj.MaxPrice=20000;
		  execute(obj,false);
	  }
	  //console.log(priceObj);
	  //console.log(totalResults);
	})
}
function getPriceRange(obj){
	var priceIndex=0;
	var returnFlag=false;
	if(obj.ItemPage>1 || (obj.TotalResults>minResponseLimit && obj.TotalResults<100)){
		return true;
	}
	if(obj.TotalResults==0){
		obj.MaxPrice+=obj.PriceRange;
		return false;
	}
	if(obj.TotalResults>100){
		priceIndex=Math.round((obj.TotalResults-100)/10);
		obj.PriceRange-=obj.PriceRange*priceIndex/10;
		obj.MaxPrice-=obj.PriceRange;
	}else{
		priceIndex=Math.round((100-obj.TotalResults)/10);
		obj.PriceRange+=obj.PriceRange*priceIndex/10;
		obj.MaxPrice+=obj.PriceRange;
	}
	obj.MaxPrice = Math.round(obj.MaxPrice);
	obj.PriceRange = Math.round(obj.PriceRange);
	return returnFlag;
}

function parseCurrentResponse(resp,obj){
	console.log('response processed');
	var items = resp.ItemSearchResponse.Items[0].Item;
	var totalResults = resp.ItemSearchResponse.Items[0].TotalResults[0];
	var totalPages = resp.ItemSearchResponse.Items[0].TotalPages[0];
	totalparsedResults+=items.length;
	// console.log('totalparsed results:'+totalparsedResults);
	// console.log(obj);
	// console.log('totalpages:'+totalPages);
	for(var item in items){
		productList.push(items[item]);
		var itemIndex = productList.length-1;
		var url = productList[itemIndex].DetailPageURL[0];
		//console.log(url);
		amazon_scrap.scrapByCrawler(itemIndex,url,productList[itemIndex].ItemAttributes[0],'laptops',getSpecCallBack);
		//console.log(items[item]);
	}
	if(obj.ItemPage<totalPages){
		obj.ItemPage++;
	}else{
		obj.MinPrice = obj.MaxPrice;
		obj.ItemPage=1;
		if((finalTotalResults-totalparsedResults)<100){
			minResponseLimit = finalTotalResults-totalparsedResults-1;
			if(minResponseLimit<0){
				return;
			}
			obj.MaxPrice=-1;
		}
	}
	execute(obj,false);
}

// prodAdv.call("BrowseNodeLookup", {BrowseNodeId:"1375424031"}, function(err, result) {
	// console.log('got the resp');
	// console.log(err);
  // console.log(JSON.stringify(result));
// })

function getSpecCallBack(productIndex, obj,category){
	console.log('final obj:');
	console.log(obj);
	//productCounter++;
	amazon_savespec.saveSpecifications(productIndex,obj,category, saveSpecCallBack);
}

function saveSpecCallBack(productIndex, specId,specObj){
	productCounter++;
	//console.log(specId);
	//return;
	var time = new Date();
	var jsonDate = time.toJSON();
		var specIdStr = specId;
		console.log('specStr'+specIdStr);
		//console.log('totalSpecsId:'+productSpecId);
		var specObjStr = JSON.stringify(specObj); 
		
		var OfferSummary = productList[productIndex].OfferSummary[0];
		var productAttributes = productList[productIndex].ItemAttributes[0];
		var imageSet = productList[productIndex].ImageSets[0].ImageSet[0];
		// console.log('productIndex:'+productIndex);
		// console.log('productImage:'+productList[productIndex].MediumImage[0]);
		// console.log('productListprice:');console.log(productAttributes.ListPrice);
		// console.log('productLowestPrice:'+OfferSummary.LowestNewPrice[0].Amount);
		// console.log('productindex:'+productIndex);
		// console.log(productList[productIndex].ASIN);
		var maxprice = productAttributes.ListPrice!=undefined?productAttributes.ListPrice[0].Amount:OfferSummary.LowestNewPrice[0].Amount;
		var category='laptops'; 
		var sql = 'insert into `sepp_product_amazon` (`product_identifier`,`spec_id`,`prime_id`,`product_brand`,`title`,`inStock`,`manufacturer_id`,`shipping`,`mrp`,`selling_price`,`date_added`,`date_modified`,`viewed`,`emi_available`,`cod_available`,`image`,`discount_percentage`,`product_url`,`category`) values ('+mysql.escape(productList[productIndex].ASIN[0])+','+mysql.escape(specObjStr)+','+specId+','+mysql.escape(productAttributes.Brand)+','+mysql.escape(productAttributes.Title)+',1,1,1,'+maxprice/100+','+OfferSummary.LowestNewPrice[0].Amount/100+','+mysql.escape(jsonDate)+','+mysql.escape(jsonDate)+','+1+','+1+','+1+','+mysql.escape(imageSet.MediumImage[0].URL[0])+','+mysql.escape(1)+','+mysql.escape(productList[productIndex].DetailPageURL)+','+mysql.escape(category)+')';
		//console.log(sql);
		pool.query(sql, function(err, rows, fields) 
		{
			if (err) console.log(err);
			console.log('inserted:'+productIndex);
		});
		if(productCounter==finalTotalResults){
		var d = new Date();
	    var stopTime = d.getTime();
		var elapsedTime = stopTime - startTime;
			console.log('completed in '+elapsedTime);
		}
	//}
}
