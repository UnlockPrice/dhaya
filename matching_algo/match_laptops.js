var	mysql = require('mysql');
var wait = require('wait.for');
var config = require('../config/config.js');
var fs = require('fs');
var funcs = require('./laptops_functions.js');
var rules = require('./laptops_rules.js').rules;
var pool      =    mysql.createPool({
	connectionLimit : 30, //important
	host     : config.host, 
	user     : config.user, 
	password : config.password,  
	database : config.database,
	multipleStatements:true
});
var matches = [];	
var d = new Date();
var startTime = d.getTime();
var overallTime;
fs.writeFile('laptops_match.txt', '');
var count = 0;
var resultQ = [];
var maxConnection=1;
var flipkartResult=[];
var snapdealResult=[];
var amazonResult=[];
var requestCount=0;
wait.launchFiber(getResults);
function getResults(){
	var sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price` from	`sepp_product_flipkart` where `category`='laptops' ";
	flipkartResult = wait.forMethod(pool,'query',sql);
	console.log('flipkar length'+flipkartResult.length);
	sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price`  from	`sepp_product_snapdeal` where `category`='laptops' ";
	snapdealResult = wait.forMethod(pool,'query',sql);
	sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price`  from	`sepp_product_amazon` where `category`='laptops'";
	amazonResult = wait.forMethod(pool,'query',sql);
	console.log('amazon length'+amazonResult.length);
	compareResults(flipkartResult,snapdealResult,amazonResult);
}

function compareResults(result1,result2,result3){
	var out = "";
	var count = 0;
	var snapdealCurrentMatch='';
	var amazonCurrentMatch='';
	var snapdealMatchList={};
	var amazonMatchList={};
	loop1:for(var i=0;i<result1.length;i++)
	{
		var arr1 = JSON.parse(result1[i].spec_id);
		if(arr1['modelid'] && arr1['modelid']!="-1")
		{
			arr1['modelid'] =arr1['modelid'].replace(/(\(.*?\))/g, '').split("/")[0].replace(/[^a-z\d]+/gi, "");			
		}
		if(arr1['modelname'] && arr1['modelname']!="-1")
		{			
			arr1['modelname'] =arr1['modelname'].split("/")[0].replace(/[^a-z\d]+/gi, "");
		}
		arr1["title"]=result1[i].title;
		snapdealCurrentMatch='';
		loop2:for(var k=0;k<rules['flipkart_snapdeal']['laptops'].length;k++)
		{
			loop3:for(var j=0;j<result2.length;j++)
			{
				if(!snapdealMatchList.hasOwnProperty(result2[j].product_identifier)){
					var arr2 = JSON.parse(result2[j].spec_id);
					if(arr2['modelid'] && arr2['modelid']!="-1"){
						arr2['modelid'] =arr2['modelid'].replace(/(\(.*?\))/g, '').split("/")[0].replace(/[^a-z\d]+/gi, "");						
					}
					if(arr2['modelname'] && arr2['modelname']!="-1")
					{			
						arr2['modelname'] =arr2['modelname'].split("/")[0].replace(/[^a-z\d]+/gi, "");
					}
					arr2["title"] = result2[j].title;
					//console.log(rules['laptops'].length);
					
					if ( funcs.decodeRules(arr1,arr2,rules['flipkart_snapdeal']['laptops'][k]) )
					{
						//out += result1[i].title+ "::"+ result2[j].title+"\n";
						count++;
						snapdealCurrentMatch=result2[j].product_identifier;
						snapdealMatchList[snapdealCurrentMatch]='';
						break loop2;
					}
				}
			}
		}
		amazonCurrentMatch='';
		//console.log('amazon length'+result3.length);
		loop4:for(var k=0;k<rules['flipkart_amazon']['laptops'].length;k++)
		{
			loop5:for(var j=0;j<result3.length;j++)
			{
				//console.log(result3[j].product_identifier)
				if(!amazonMatchList.hasOwnProperty(result3[j].product_identifier)){
					var arr2 = JSON.parse(result3[j].spec_id);
					if(arr2['modelid'] && arr2['modelid']!="-1"){
						arr2['modelid'] =arr2['modelid'].replace(/(\(.*?\))/g, '').split("/")[0].replace(/[^a-z\d]+/gi, "");						
					}
					if(arr2['modelname'] && arr2['modelname']!="-1")
					{			
						arr2['modelname'] =arr2['modelname'].split("/")[0].replace(/[^a-z\d]+/gi, "");
					}
					arr2["title"] = result3[j].title;
					//console.log(rules['laptops'].length);
					
					if ( funcs.decodeRules(arr1,arr2,rules['flipkart_amazon']['laptops'][k]) )
					{
						//out += result1[i].title+ "::"+ result3[j].title+"\n";
						count++;
						amazonCurrentMatch=result3[j].product_identifier;
						amazonMatchList[amazonCurrentMatch]='';
						break loop4;
					}
				}
			}
		}
		
		if(snapdealCurrentMatch!='' || amazonCurrentMatch!=''){
			var myparams = "'"+result1[i].product_identifier+"','"+snapdealCurrentMatch+"','"+amazonCurrentMatch+"'";
			console.log(myparams);
			resultQ.push(myparams);
		}
	}
	
	for (var i=0;i<resultQ.length;i++){
		saveProductMatches(resultQ[i]);
	}
	//fs.appendFile('laptops_match.txt', out, function (err) {if (err) return console.log(err);});
	var d1 = new Date();
		var stopTime = d1.getTime();
		var elapsedTime = stopTime - startTime;
		overallTime = startTime;
		startTime = d1.getTime();
		console.log('completed in '+elapsedTime);
		console.log('count'+ count);
	//process.exit(0);
}		

function testmethod(){
		console.log('testmethod');
}

function saveProductMatches(params){
	console.log('product match'+params);
	requestCount++;
	pool.query("call sp_saveProductMatches("+params+")", saveProductMatchCallback);
	return;
}

function saveProductMatchCallback(err,result){
	if (err) {
			console.log('ERROR: '+err);
			//connection.release();
			return;
		}
		console.log("product match saved");
		requestCount--;
		if(requestCount<=1){
			var d1 = new Date();
			var stoptime= d1.getTime();
			var elapsedTime = stoptime - startTime;
			var totalTime= stoptime - overallTime;
			console.log('db insertion completed in '+elapsedTime);
			console.log('total time '+ totalTime);
		}
		return;
}

function substringExists(str1,str2)
{
	if( str1.indexOf(str2)!=-1 )
	return true;
	else
	return false;
}
function keyAndSubstringExists(key,arr1,str1,arr2,str2)
{
	if( ( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key)) && ((str1.indexOf(str2)!=-1) || (str2.indexOf(str1)!=-1)) )
	return true;
	else
	return false;
}

function keyAndSubstringExists_rare(key,arr1,str1,arr2,str2)
{
	if( ( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key)) && ((str1.indexOf(str2)!=-1) || (str2.indexOf(str1)!=-1)) )
	return true;
	else
	return myXOR(arr1.hasOwnProperty(key),arr2.hasOwnProperty(key));
}
function keyExists(key,arr1,arr2)
{
	
}

function keyAndEqualExists(key,arr1,str1,arr2,str2)
{
	if( arr1.hasOwnProperty(key) && arr2.hasOwnProperty(key) && str1 && str2 &&(str1==str2) ) 
	return true;
	else
	return false;
}
function myXOR(bool1,bool2)
{
	if ( !bool1 == !bool2)
	return true;
	else
	return false;
}