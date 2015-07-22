var strand = require('strand');

exports.decodeRules= function(arr1,arr2,rules)
{
	var resultStack = [];
	var tmp = rules.split(" ");
	
	for(var i=0;i<tmp.length;i++)
	{
		if (tmp[i]==")")
		{
			/*
				var oprnd1 = resultStack.pop();
				var opr = resultStack.pop();
				var oprnd2 = resultStack.pop();
				var br = resultStack.pop();
				var result = function_calculate(arr1,oprnd1,opr,arr2,oprnd2);
				resultStack.push(result);
			*/
			do
			{
				var oprnd1 = resultStack.pop();
				var opr = resultStack.pop();
				var oprnd2 = resultStack.pop();
				var br = resultStack.pop();
				if(br != "(" )
				resultStack.push(br);
				var result = function_calculate(arr1,oprnd1,opr,arr2,oprnd2);
				resultStack.push(result);
			}
			while( br != "(" )
		}
		else
		{
			if(tmp[i])
			resultStack.push(tmp[i]);
		}
		
		
	}
	if (resultStack.length != 1)
	return "Error";
	else
	return resultStack.pop();
}

function function_calculate(arr1,key1,opr,arr2,key2)
{
	if (opr == "EQ")
		return keyAndEqualExists(arr1,key1,arr2,key2);
	else if(opr == "SU")
		if(key1==key2)
			return keyAndSubstringExists(arr1,key1,arr2,key2);
		else
			return keyAndSubstringExists(arr1,key1,arr2,key2) || keyAndSubstringExists(arr1,key2,arr2,key1);
	else if(opr == "SUR")
		return keyAndSubstringExists_rare(arr1,key1,arr2,key2);
	else if(opr == "SS")
		return keyAndSubsequenceExists(arr1,key1,arr2,key2);
	else if(opr == "ASE")
		return keyAndArraySubsetEqualExists(arr1,key1,arr2,key2);
	else if(opr == "LCSU")
		return keyAndLCSUExists(arr1,key1,arr2,key2);
	else if(opr == "AND")
		return (key1 && key2);
	else if(opr == "OR")
		return (key1 || key2);
	
}

var arraySubset = function (arr1, arr2) {
    return arr2.some(function (v) {
        return arr1.indexOf(v) >= 0;
	});
};


function keyAndArraySubsetEqualExists(arr1,key1,arr2,key2)
{
	if(  arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2) && arr1[key1] && arr2[key2] )
	{
		var regexp = new RegExp('[-+()*/.:? ]', 'g');
		//var tmp1 = arr1[key1].replace(/(\(.*?\))/g, '').split("/");
		//var tmp2 = arr2[key2].replace(/(\(.*?\))/g, '').split("/");
		var tmparr1 = arr1[key1].split(regexp);
		var tmparr2 = arr2[key2].split(regexp);
		if( arraySubset(tmparr1,tmparr2) )
		return true;
		else
		return false;
	}
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}

function keyAndLCSUExists(arr1,key1,arr2,key2)
{
	if(  arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2) && arr1[key1] && arr2[key2]  && arr1[key1]!="-1" && arr2[key2]!="-1" )
	{
		var minlen = ( arr1[key1].length < arr2[key2].length ) ? (arr1[key1].length):(arr2[key2].length);
		if( findLongestCommonSubstring(arr1[key1],arr2[key2]).length >= minlen-3 )
			return true;
		else
			return false;
	}
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}

function substringExists(str1,str2)
{
	if( str1.indexOf(str2)!=-1 )
	return true;
	else
	return false;
}
function keyAndSubstringExists(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && arr1[key1]!="-1" && arr2[key2]!="-1" && ((arr1[key1].indexOf(arr2[key2])!=-1) || (arr2[key2].indexOf(arr1[key1])!=-1)) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function keyAndSubsequenceExists(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && arr1[key1]!="-1" && arr2[key2]!="-1" && mySubsequence(arr1[key1],arr2[key2]) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function mySubsequence(str1,str2)
{
	if(strand.subSequence(str1,str2).sequence==str1 || strand.subSequence(str1,str2).sequence ==str2 )
	return true;
	else
	return false;
}

function keyAndSubstringExists_rare(arr1,key1,arr2,key2)
{
	if( ( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2)) && arr1[key1] && arr2[key2] && ((arr1[key1].indexOf(arr2[key2])!=-1) || (arr2[key2].indexOf(arr1[key1])!=-1)) )
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}

function keyAndEqualExists(arr1,key1,arr2,key2)
{
	if( arr1.hasOwnProperty(key1) && arr2.hasOwnProperty(key2) && arr1[key1] && arr2[key2] && arr1[key1]!="-1" && arr2[key2]!="-1" && (arr1[key1]==arr2[key2]) ) 
	return true;
	else
	return rulesExceptions(arr1,key1,arr2,key2);
}
function rulesExceptions(arr1,key1,arr2,key2)
{
	//if ( !bool1 == !bool2)
	if( arr1.hasOwnProperty(key1)==false && arr2.hasOwnProperty(key2)==false )
		return true;
	else if ( ( arr1.hasOwnProperty(key1)==false && arr2.hasOwnProperty(key2) && arr2[key2]=="-1" ) || ( arr2.hasOwnProperty(key2)==false && arr1.hasOwnProperty(key1) && arr1[key1]=="-1" ))
		return true;
	else if ( ( arr1.hasOwnProperty(key1) && arr1[key1]=="no" && arr2.hasOwnProperty(key2) && arr2[key2]=="-1" ) || ( arr2.hasOwnProperty(key2) && arr2[key2]=="no" && arr1.hasOwnProperty(key1) && arr1[key1]=="-1" ) )
		return true;
	else
		return false;
}

function findLongestCommonSubstring(a,b)
{
  var longest = "";
  // loop through the first string
  for (var i = 0; i < a.length; ++i) {
    // loop through the second string
    for (var j = 0; j < b.length; ++j) {
      // if it's the same letter
      if (a[i] === b[j]) {
        var str = a[i];
        var k = 1;
        // keep going until the letters no longer match, or we reach end
        while (i+k < a.length && j+k < b.length // haven't reached end
               && a[i+k] === b[j+k]) { // same letter
          str += a[i+k];
          ++k;
        }
        // if this substring is longer than the longest, save it as the longest
        if (str.length > longest.length) { longest = str }
      }
    }
  }
  return longest;
}

var longest_common_substring = function(S, T) {
	
	
	var D = [];
	var LCS_len = 0;
	var LCS = [];

	for (var i = 0; i < S.length; i++) {
		D[i] = [];
		for (var j = 0; j < T.length; j++) {
			if (S[i] == T[j]) {
				if (i == 0 || j == 0) {
					D[i][j] = 1;
				} else {
					D[i][j] = D[i-1][j-1] + 1;
				}

				if (D[i][j] > LCS_len) {
					LCS_len = D[i][j];
					LCS = [S.substring(i-LCS_len+1, i+1)];
				} else if (D[i][j] == LCS_len) {
					LCS.push(S.substring(i-LCS_len+1, i+1));
				}
			} else {
				D[i][j] = 0;
			}
		}
	}
	return [D, {"LCS": LCS}, {"LCS_len": LCS_len}];
}