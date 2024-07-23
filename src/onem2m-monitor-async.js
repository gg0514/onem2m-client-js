var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// SP-relative Scope Format  : /~/cseID/cseName
// CSE relative Scope Format : /cseName

var cse_uri= "http://192.168.4.197:7579/~/Mobius2/Mobius";		



app.use(bodyParser.json());

app.listen(3000, function () {
	console.log('AE Monitor listening on port 3000!');
});


// notification URI 통해서 Event 수신
app.post('/', function (req, res) {
	console.log("\n◀◀◀◀◀")
	console.log(req.body);

	var content = req.body["m2m:sgn"].nev.rep["m2m:cin"].con;
	console.log("Receieved luminosity: "+content);

	// 조도센서 측정값을 수신하고,  
	// 스위치 컨테이너에 명령값 송신
	if(content>5){
		console.log("High luminosity => Switch lamp OFF");
		createContenInstance(false);
	}else{
		console.log("Low luminosity => Switch lamp ON");
		createContenInstance(true)
	}
	res.sendStatus(200);	
});

createAE();

function createAE(){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-monitor-async";
	var method = "POST";
	var uri= cse_uri;
	var resourceType=2;
	var requestId = "123456";
	var representation = {
		"m2m:ae":{
			"rn":"mymonitor-async",			
			"api":"app.company.com",
			"rr":"true",
			"poa":["http://192.168.4.168:3000/"]
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
	var originator = "Cae-monitor-async";
	var method = "POST";
	//var uri= "http://127.0.0.1:8080/~/server/server/mysensor/luminosity";
	var uri= cse_uri+ "/mysensor/luminosity";				// 조도센서 측정값 구독 신청
	var resourceType=23;
	var requestId = "123456";

	// Resource Identifier in CSE-relative format: Cae-monitor-async
	// Resource Identifier in SP-relative format : /Mobius2/Cae-monitor-async
	// Resource Identifier in Absolute format 	 : //SPID/CSEID/MyResourceID
	var representation = {
		"m2m:sub": {
			"rn": "subMonitor",
			"nu": ["Cae-monitor-async"],			// Monitor 에서 측정값 수신		
			"nct": 2,
			"enc": {
				"net": [3]
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

function createContenInstance(value){
	console.log("\n▶▶▶▶▶");
	var originator = "Cae-monitor-async";
	var method = "POST";
	//var uri= "http://127.0.0.1:8080/~/server/server/myactuator/switch";
	var uri= cse_uri + "/myactuator/switch"
	var resourceType=4;
	var requestId = "123456";
	var representation = {
		"m2m:cin":{
				"con": value
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
		console.log("◀◀◀◀◀ "+ now.toLocaleString());
		if(error){
			console.log(error);
		}else{
			console.log(response.statusCode);
			console.log(body);
		}
	});
}

