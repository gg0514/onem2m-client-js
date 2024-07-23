var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// SP-relative Scope Format  : /~/cseID/cseName
// CSE relative Scope Format : /cseName

var cse_uri= "http://192.168.4.197:7579/~/Mobius2/Mobius";				


app.use(bodyParser.json());

app.listen(4000, function () {
	console.log('AE Actuator listening on port 4000!');
});


// notification URI 통해서 Event 수신
app.post('/', function (req, res) {
	const now = new Date();
	console.log("\n◀◀◀◀◀ " + now.toLocaleString())
	console.log(req.body);

	var content = req.body["m2m:sgn"].nev.rep["m2m:cin"].con;
	console.log("Actuator switched to "+content);
	res.sendStatus(200);
});

createAE();

function createAE(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-actuator";
	var method = "POST";
	var uri= cse_uri;
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"myactuator",			
			"api":"app.company.com",
			"rr":"true",
			"poa":["http://192.168.4.168:4000/"]
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
	var originator = "Cae-actuator";
	var method = "POST";
	var uri= cse_uri+ "/myactuator";
	var resourceType=3;
	var requestId = "123456";
	var representation = {
		"m2m:cnt":{
			"rn":"switch",
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
			createContentInstance();
		}
	});
}


function createContentInstance(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-actuator";
	var method = "POST";
//	var uri= "http://127.0.0.1:8080/~/server/server/myactuator/switch";
	var uri= cse_uri+ "/myactuator/switch";
	var resourceType=4;
	var requestId = "123456";
	var representation = {
		"m2m:cin":{
			"con": false
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

			createSubscription();
		}
	});
}


function createSubscription(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-actuator";
	var method = "POST";
	var uri= cse_uri+ "/myactuator/switch";
	var resourceType=23;
	var requestId = "123456";
	var representation = {
		"m2m:sub": {
			"rn": "subTest",
			"nu": ["Cae-actuator"],							// notification URI - CSE relatvie URI
			"nct": 2,										// notification content type
			"enc": {										// event notification criteria
				"net": [3]									// notification event type
			}
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
		}
	});
}

