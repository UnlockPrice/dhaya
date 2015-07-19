var excluded = require('./amazon_scrapobj.js').excluded;

var specId='';
var http,mysql,pool;
//initialize();
//var objs={'model':'acer'};
//saveSpecifications(0,objs,'laptops',testfun);
exports.initialize = function (){
console.log('specification initialize');
	//var querystring = require('querystring');
	// var fs = require('fs');

	// // file is included here:
	// eval(fs.readFileSync('test.js')+'');
	http = require('https');
	mysql      = require('mysql');
	pool      =    mysql.createPool({
		connectionLimit : 500, //important
		host     : 'localhost',  
		 user     : 'root',  
		 password : '',  
		database : 'sepp2015',
		multipleStatements:true
	});
	
}
exports.saveSpecifications = function(productIndex,obj,category, callback){
	console.log('getSpecifications');
	var count=0;
		var counter=0;
		for(var key in obj){
			count++;
		}
		if(count==0){
		callback(productIndex, '',obj);
		return;
		}
	pool.getConnection(function(err,connection){
		if (err) {
		console.log('ERROR: '+err);
		  connection.release();
		  res.json({"code" : 100, "status" : "Error in connection database"});
		  return;
		}
		
		var specsArr=[];
		var index=0;
		var finalSpecId=1;
		for(var key in obj){
			if((category in excluded) && ( excluded[category].indexOf(key)!= -1)){
			//console.log('got the x');
				index++;
				counter++
				if(count==counter){
					connection.release();
					console.log('connection released');
					finalSpecId = finalSpecId==1?-1:finalSpecId;
					callback(productIndex, finalSpecId,obj);
					return;
				}
				continue;
			}
			var myparams = "'"+category+"','"+key+"','"+obj[key]+"'";
			connection.query("call sp_saveSpecification("+myparams+",@specid)", function(err, result) {
				if (err) {
				console.log('ERROR: '+err);
				  connection.release();
				  //res.json({"code" : 100, "status" : "Error in connection database"});
				  return;
				}   
				counter++;
				
				//console.log('output'+parseSpecId(result));
				//console.log(result[0][0].specId);
				var specId = result[0][0].specId;
				finalSpecId *= parseInt(specId);
				index++;
				if(count==counter){
					connection.release();
					console.log('connection released');
					finalSpecId = finalSpecId==1?-1:finalSpecId;
					callback(productIndex, finalSpecId,obj);
				}
				//console.log(outparam);
				console.log('query ended');	
			 });
		}
	 });
	 //return specId;
 }

parseSpecId = function(result){
	if(result && (Array.isArray(result) || typeof(result)=='object')){
		for(var index in result){
			if(index=='specId'){
				return result[index];
			}else{
				var retVal = parseSpecId(result[index]);
				if(retVal!=undefined){
				return retVal;
				}
			}
		}
	}
}

function testfun(productIndex, specIdStr){
console.log('time'+specIdStr);
}
function sortFunc(a,b){
	return a-b;
}