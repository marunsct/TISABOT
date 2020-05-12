exports.GetProxy = function (xsuaa, dest, conn, dName) {
	/********************************************************************************
	 **** Step 1: Get the service instance of XSUAA, Destination and Connectivity ***
	 ********************************************************************************/
	const cfenv = require('cfenv');
	const tok = require('./promise_req');

	const uaa_service = cfenv.getAppEnv().getService(xsuaa);
	//console.log(uaa_service);
	const dest_service = cfenv.getAppEnv().getService(dest);
	//console.log(dest_service + ' w');
	const con_service = cfenv.getAppEnv().getService(conn);

	const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

	const sConCredentials = con_service.credentials.clientid + ':' + con_service.credentials.clientsecret;

	/*********************************************************************
	 **** Step 2: Request a JWT token to access the destination service ***
	 *********************************************************************/
	const post_options = {
		url: uaa_service.credentials.url + '/oauth/token',
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
			'Content-type': 'application/x-www-form-urlencoded'
		},
		form: {
			'client_id': dest_service.credentials.clientid,
			'grant_type': 'client_credentials'
		}
	};

	var sDest = tok.Gettok(post_options)
		.then(function (result) {
			// 

			const token = JSON.parse(result.body).access_token;
			//console.log(token);
			const get_options = {
				url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + dName,
				headers: {
					'Authorization': 'Bearer ' + token
				}
			};
			var destination_r = tok.Gettok(get_options);
			return destination_r;
		})
		.then(function (result) {
			//
			//e05 = JSON.parse(result.body).destinationConfiguration;
			//e05_auth = JSON.parse(result.body).authTokens[0];
			//console.log(e05_auth);
			var oDest = {
				e05: JSON.parse(result.body).destinationConfiguration,
				e05_auth: JSON.parse(result.body).authTokens[0]
			};
			//return oDest;
			return new Promise(function (resolve, reject) {
				resolve(oDest);
			});
		})
		.catch(function (error) {

			return new Promise(function (resolve, reject) {
				console.log(error);
				reject(error);
			});
		});

	const cpost_options = {
		url: uaa_service.credentials.url + '/oauth/token',
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + Buffer.from(sConCredentials).toString('base64'),
			'Content-type': 'application/x-www-form-urlencoded'
		},
		form: {
			'client_id': con_service.credentials.clientid,
			'grant_type': 'client_credentials'
		}
	};
	var con_req = tok.Gettok(cpost_options)
		.then(function (result) {
			// 
			return new Promise(function (resolve, reject) {

				resolve({
					token: JSON.parse(result.body).access_token,
					phost: con_service.credentials.onpremise_proxy_host,
					pport: con_service.credentials.onpremise_proxy_port
				});
			});
			//	return result;
		})
		.catch(function (error) {

			return new Promise(function (resolve, reject) {
				console.log(error);
				reject(error);
			});
			//return error;
		});

	var finalres = Promise.all([
			sDest.catch(error => {
				return error;
			}),
			con_req.catch(error => {
				return error;
			})
		])
		.then(values => {
			/*  console.log(values[0]);
			  console.log(values[1]);
			  console.log(values);*/

			return new Promise(function (resolve, reject) {

				resolve(values);
			});

		});

	return finalres;

};