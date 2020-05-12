/*eslint no-console: 0*/
"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config');
const resptt = require('./reply');
const cfenv = require('cfenv');
const tok = require('./promise_req');
const pcon = require('./promise_connection');
//const axios = require('axios');

const app = express();

//var url1 ="http://tyoaw21156.tyoaw21.enet.accenture.com:50000/sap/opu/odata/sap/Y_CHATBOT_SRV_01/CHATBOTSet(Product=' ',Quantity=' ',Ponum='123456')?$format=json"; //
var url = 'http://tyoaw21156.tyoaw21.enet.accenture.com:50000/sap/opu/odata/sap/'; //CHATBOTSet(Product=' ',Quantity=' ',Ponum='123456')?$format=json
var eSet = "Y_CHATBOT_SRV_01/";
//var ores;
var csrfToken;
//var replyContent;
var reply;
var cookies;
var e05;
var e05_auth;
//var connec;

//var areq;

app.use(bodyParser.json());

//app.set('port', (process.env.PORT || 5000));
app.set('port', config.PORT);

/////////////////////////////

app.get('/', function (req, res) {
	//res.send('Use the /api/askBot endpoint.');
	pcon.getCon().then(function (value) {
		res.send(value);
	});

});

app.post('/dest', function (req, res) {
	
	const oServices = cfenv.getAppEnv().getServices();

});


app.listen(app.get('port'), function () {
	console.log('* Webhook service is listening on port:' + app.get('port'));
});
