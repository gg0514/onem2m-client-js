var express = require('express');
var request = require('request');

// SP-relative Scope Format  : /~/cseID/cseName
// CSE relative Scope Format : /cseName

var cse_uri= "http://192.168.4.197:7579/~/Mobius2/Mobius";				
																

createAE();
function createAE(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-sensor";									// AE ID
	var method = "POST";
	var uri= cse_uri;
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"mysensor",			
			"api":"app.company.com",
			"rr":"false"
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": originator,
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
			createContainer();
		}
	});
}


function createContainer(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-sensor";
	var method = "POST";
	var uri= cse_uri+ "/mysensor";
	var resourceType=3;
	var requestId = "123456";
	var representation = {
		"m2m:cnt":{
			"rn":"luminosity",
			"mni":100		

		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": originator,
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀");
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);

			// 5초에 한번씩 조도 데이터 생성
			setInterval(function() {
				createContentInstance();
			}, 5000);
		}
	});
}

function createContentInstance(){

	console.log("\n▶▶▶▶▶");
	var originator = "Cae-sensor";
	var method = "POST";
	var uri= cse_uri+ "/mysensor/luminosity";
	var resourceType=4;
	var requestId = "123456";
	var representation = {
		"m2m:cin":{
			"con": Math.floor(Math.random()*10)
		}
	};

	console.log(method+" "+uri);
	console.log(representation);

	var options = {
		uri: uri,
		method: method,
		headers: {
			"X-M2M-Origin": originator,
			"X-M2M-RI": requestId,
			"Content-Type": "application/json;ty="+resourceType
		},
		json: representation
	};

	const now = new Date();

	request(options, function (error, response, body) {
		console.log("◀◀◀◀◀ " + now.toLocaleString());
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
		}
	});
}
