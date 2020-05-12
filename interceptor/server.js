/*eslint no-console: 0*/
"use strict";

const express = require('express');
const bodyParser = require('body-parser');
//const request = require('request');
const config = require('./config');
//const resptt = require('./reply');
const cfenv = require('cfenv');
const tok = require('./CustomModules/promise_req');
const pcon = require('./CustomModules/reverseProxy');
//const axios = require('axios');
const xenv = require('@sap/xsenv');


const app = express();

app.use(bodyParser.json());

//app.set('port', (process.env.PORT || 5000));
app.set('port', config.PORT);

/////////////////////////////

app.get('/', function (req, res) {
	
var	reply = [{
						type: 'text',
						content: "how are you"
					}, {
						type: 'text',
						content: "How Can I help you?"
					}];
				var response = JSON.stringify({
				replies: reply,
				conversation: {
					memory: ""
				}
			});
			//console.log(respon + 'hii');
			res.statusCode = 200;
			res.setHeader('content-type', 'application/json');
			res.send(response);	

});

app.post('/dest', function (req, res) {
	
	const oServices = cfenv.getAppEnv().getServices();

});


app.listen(app.get('port'), function () {
	console.log('* Webhook service is listening on port:' + app.get('port'));
});
