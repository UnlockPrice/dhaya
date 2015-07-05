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

fs.writeFile('laptops_match.txt', '');
var count = 0;
var resultQ = []
var maxConnection=1;
var flipkartResult=[];
var snapdealResult=[];
wait.launchFiber(getResults);
function getResults(){
	var sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price` from	`sepp_product_flipkart` where `category`='laptops' ";
	flipkartResult = wait.forMethod(pool,'query',sql);
	console.log('flipkar length'+flipkartResult.length);
	sql = "select `product_identifier`, `spec_id`, `product_brand`,`title`, `selling_price`  from	`sepp_product_snapdeal` where `category`='laptops' ";
	snapdealResult = wait.forMethod(pool,'query',sql);
	compareResults(flipkartResult,snapdealResult);
}

function compareResults(result1,result2){
	var out = "";
	var count = 0;
	loop1:for(var i=0;i<result1.length;i++)
	{
<<<<<<< HEAD
		var arr1 = JSON.parse(result1[i].spec_id);
=======
		var out = "";
		
		loop1:for(var i=0;i<result.length;i++)
		{
			var arr1 = JSON.parse(result[i].spec_id);
>>>>>>> origin/master
		if(arr1['modelid'] && arr1['modelid']!="-1")
		{
			arr1['modelid'] =arr1['modelid'].replace(/(\(.*?\))/g, '').split("/")[0].replace(/[^a-z\d]+/gi, "");
		}
		arr1["title"]=result1[i].title;
		loop2:for(var k=0;k<rules['laptops'].length;k++)
		{
			loop3:for(var j=0;j<result2.length;j++)
			{
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
				
				if ( funcs.decodeRules(arr1,arr2,rules['laptops'][k]) )
				{
<<<<<<< HEAD
					out += result1[i].title+ "::"+ result2[j].title+"\n";
					count++;
					//out += result[i].product_identifier+ "::"+ snapdealResult[j].product_identifier+"\n";
					var myparams = "'"+result1[i].product_identifier+"','"+result2[j].product_identifier+"',''";
					// if(count>maxConnection){
						// resultQ.push(myparams);
					// }else{
						saveProductMatches(myparams);
					// }
					// if(count>5)
						// break loop1;
					break loop2;
=======
					var arr2 = JSON.parse(result1[j].spec_id);
					if(arr2['modelid'] && arr2['modelid']!="-1")
						arr2['modelid'] =arr2['modelid'].split("/")[0].replace(/(\(.*?\))/g, '').replace(/[^a-z\d]+/gi, "");
					arr2["title"] = result1[j].title;
					//console.log(rules['laptops'].length);
					
					if ( funcs.decodeRules(arr1,arr2,rules['laptops'][k]) )
					{
						out += result[i].title+ "::"+ result1[j].title+"\n";
						//out += result[i].product_identifier+ "::"+ result1[j].product_identifier+"\n";
						break loop2;
					}
					
					
					/*
						if( keyAndEqualExists ("brand",arr1,arr1["brand"],arr2,arr2["brand"]) )
					{
					if( keyAndEqualExists("modelname",arr1,arr1["modelname"],arr2,arr2["modelname"]) && keyAndEqualExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) )
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					else if( arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelid"],arr2["title"]) && keyAndEqualExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndEqualExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndEqualExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndEqualExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]))
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					else if( keyAndSubstringExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"])  && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
					{
					
					out += result[i].title+ "::"+ result1[j].title+"\n";
					
					}
					else if( arr1.hasOwnProperty("modelname") && arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelname"],arr2["title"]) && substringExists(arr1["modelid"],arr2["title"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
					{
					out += result[i].title+ "::"+ result1[j].title+"\n";
					}
					
					}
					*/
>>>>>>> origin/master
				}
				
				
				/*
					if( keyAndEqualExists ("brand",arr1,arr1["brand"],arr2,arr2["brand"]) )
				{
				if( keyAndEqualExists("modelname",arr1,arr1["modelname"],arr2,arr2["modelname"]) && keyAndEqualExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) )
				{
				out += result[i].title+ "::"+ snapdealResult[j].title+"\n";
				}
				else if( arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelid"],arr2["title"]) && keyAndEqualExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndEqualExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndEqualExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndEqualExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]))
				{
				out += result[i].title+ "::"+ snapdealResult[j].title+"\n";
				}
				else if( keyAndSubstringExists("modelid",arr1,arr1["modelid"],arr2,arr2["modelid"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"])  && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
				{
				
				out += result[i].title+ "::"+ snapdealResult[j].title+"\n";
				
				}
				else if( arr1.hasOwnProperty("modelname") && arr1.hasOwnProperty("modelid") && arr2.hasOwnProperty("title") && substringExists(arr1["modelname"],arr2["title"]) && substringExists(arr1["modelid"],arr2["title"]) && keyAndSubstringExists("cpu",arr1,arr1["cpu"],arr2,arr2["cpu"]) && keyAndSubstringExists("ram",arr1,arr1["ram"],arr2,arr2["ram"]) && keyAndSubstringExists("hdd",arr1,arr1["hdd"],arr2,arr2["hdd"]) && keyAndSubstringExists("os",arr1,arr1["os"],arr2,arr2["os"]) && keyAndEqualExists("screentype",arr1,arr1["screentype"],arr2,arr2["screentype"]) )
				{
				out += result[i].title+ "::"+ snapdealResult[j].title+"\n";
				}
				
				}
				*/
			}
			
			
		}
<<<<<<< HEAD
	}
=======
		fs.appendFile('laptops_match.txt', out, function (err) {if (err) return console.log(err);});
		var d1 = new Date();
			var stopTime = d1.getTime();
			var elapsedTime = stopTime - startTime;
			console.log('completed in '+elapsedTime);
		//process.exit(0);
		
	});
>>>>>>> origin/master
	
	fs.appendFile('laptops_match.txt', out, function (err) {if (err) return console.log(err);});
	var d1 = new Date();
		var stopTime = d1.getTime();
		var elapsedTime = stopTime - startTime;
		console.log('completed in '+elapsedTime);
		console.log('count'+ count);
	//process.exit(0);
}		

function saveProductMatches(params){
	console.log('product match'+params);
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