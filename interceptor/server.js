/*eslint no-console: 0*/
"use strict";

const express = require('express');
const bodyParser = require('body-parser');
//const request = require('request');
const config = require('./config');
//const resptt = require('./reply');
//const cfenv = require('cfenv');
//const tok = require('./CustomModules/promise_req');
const pcon = require('./CustomModules/reverseProxy');
const oDataRequest = require("./CustomModules/oDataRequest");
const caiOperations = require("./CustomModules/caiOperations");
//const axios = require('axios');
//const xenv = require('@sap/xsenv');

const app = express();

app.use(bodyParser.json());

//app.set('port', (process.env.PORT || 5000));
app.set('port', config.PORT);

const sXsuaa = "TISABOT-interceptor-usaa-P20011919diXhwtGyHYDayUCb";
const sConn = "TISABOT-Tisa-connectivity-P2001191B8kdjz6S4DfTP589";
const sDest = "TISABOT-Tisa-Destination-P20011919ihZDAJI2H87wWyq/";
const sDestNme = "JS7";
const sEndpoint = "/sap/opu/odata/sap/ZSRV_SOCHATBOT_SRV/";
/////////////////////////////

app.get('/', function (req, res) {
	console.log("hello");

	pcon.GetProxy(sXsuaa, sDest, sConn, sDestNme).then(function (value) {
		console.log(value);
	});

	//console.log(respon + 'hii');
	res.statusCode = 200;
	res.setHeader('content-type', 'application/json');
	res.send("response");

});

app.post('/SalesorderStatus', function (req, res) {

	var sDestination, sDestAuth, tokenc, phost, pport;
	var memory = req.body.conversation.memory;

	pcon.GetProxy(sXsuaa, sDest, sConn, sDestNme).then(function (value) {
		//console.log(value);
		sDestination = value[0].e05;
		sDestAuth = value[0].e05_auth;
		tokenc = value[1].token;
		phost = value[1].phost;
		pport = value[1].pport;

		var optionsJS7 = {
			url: sDestination.URL + sEndpoint + "SALES_ORDERSet('" + memory.so.raw + "')",
			proxy: "http://" + phost + ':' + pport,
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + sDestAuth.value, //YW11dGh1a3VtYXJhOkFydW5AMTIz',
				'Proxy-Authorization': 'Bearer ' + tokenc,
				'Content-Type': 'application/json',
				"accept": "application/json",
				'X-CSRF-Token': 'Fetch' // get CSRF Token for post or update
			}
		};

		// Call oData to get the values.
		oDataRequest.calloData(optionsJS7).then(body => {

			caiOperations.formatReply(memory, 'displayso', JSON.parse(body.body)).then(reply => {

				var response = JSON.stringify({
					replies: reply,
					conversation: {
						memory: memory
					}
				});
				//console.log(respon + 'hii');
				res.statusCode = 200;
				res.setHeader('content-type', 'application/json');
				res.send(response);

			});
		});

	});

});

// Get Sales Orders based on Filters

app.post("/SalesorderList", (req, res) => {

	var sDestination, sDestAuth, tokenc, phost, pport;
	var memory = req.body.conversation.memory;

	pcon.GetProxy(sXsuaa, sDest, sConn, sDestNme).then(function (value) {
		//console.log(value);
		sDestination = value[0].e05;
		sDestAuth = value[0].e05_auth;
		tokenc = value[1].token;
		phost = value[1].phost;
		pport = value[1].pport;

		var optionsJS7 = {
			url: sDestination.URL + sEndpoint + "SALES_ORDERSet?$filter",
			proxy: "http://" + phost + ':' + pport,
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + sDestAuth.value, //YW11dGh1a3VtYXJhOkFydW5AMTIz',
				'Proxy-Authorization': 'Bearer ' + tokenc,
				'Content-Type': 'application/json',
				"accept": "application/json",
				'X-CSRF-Token': 'Fetch' // get CSRF Token for post or update
			}
		};

		caiOperations.getFilters(memory).then((filters) => {

			console.log(filters);
			optionsJS7.url = optionsJS7.url + filters;
			console.log(optionsJS7.url);
			oDataRequest.calloData(optionsJS7).then(body => {

				caiOperations.formatReply(memory, 'displaysoset', JSON.parse(body.body)).then(reply => {

					var response = JSON.stringify({
						replies: reply,
						conversation: {
							memory: memory
						}
					});
					//console.log(respon + 'hii');
					console.log(response);
					res.statusCode = 200;
					res.setHeader('content-type', 'application/json');
					res.send(response);

				});
			});
		});

	});
});

// Url Handle for Creating Sales Orders

app.post("/SalesorderCreate", (req, res) => {
	var sDestination, sDestAuth, tokenc, phost, pport;
	var memory = req.body.conversation.memory;

	pcon.GetProxy(sXsuaa, sDest, sConn, sDestNme).then(function (value) {
		//console.log(value);
		sDestination = value[0].e05;
		sDestAuth = value[0].e05_auth;
		tokenc = value[1].token;
		phost = value[1].phost;
		pport = value[1].pport;

		var optionsJS7 = {
			url: sDestination.URL + sEndpoint + "SALES_ORDERSet?$filter=PartnNumb eq ''",
			proxy: "http://" + phost + ':' + pport,
			method: 'GET',
			headers: {
				'Authorization': 'Basic ' + sDestAuth.value, //YW11dGh1a3VtYXJhOkFydW5AMTIz',
				'Proxy-Authorization': 'Bearer ' + tokenc,
				'Content-Type': 'application/json',
				"accept": "application/json",
				'X-CSRF-Token': 'Fetch' // get CSRF Token for post or update
			}
		};
		oDataRequest.calloData(optionsJS7).then(result => {

			optionsJS7.method = "POST";
			optionsJS7.url = sDestination.URL + sEndpoint + "SALES_ORDERSet";
			optionsJS7.headers["x-csrf-token"] = result.headers['x-csrf-token'];
			optionsJS7.headers.Cookie = result.headers['set-cookie'];

			var entity1 = {
				d: {
					DocType: "OR",
					SalesOrg: memory.sorg.raw,
					DistrChan: memory.dis_channel.raw,
					Division: memory.division.raw,
					Salesdocument: "",
					Type: "",
					Message: "",
					// PartnRole: "",
					PartnNumb: memory.customer.raw,
					//ItmNumber: "",
					Material: memory.material.raw,
					TargetQty: memory.quantity.raw
				}
			};

			optionsJS7.json = entity1;

			oDataRequest.calloData(optionsJS7).then(resp => {

				caiOperations.formatReply(memory, 'createso', resp.body).then(reply => {

					var response = JSON.stringify({
						replies: reply,
						conversation: {
							memory: memory
						}
					});
					//console.log(respon + 'hii');
					res.statusCode = 200;
					res.setHeader('content-type', 'application/json');
					res.send(response);

				});

			});

		});

	});
});

app.listen(app.get('port'), function () {
	console.log('* Webhook service is listening on port:' + app.get('port'));
});