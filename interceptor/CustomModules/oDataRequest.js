exports.calloData = function (options) {
	const request = require('request');
//	var csrfToken;
//	var url = 'dummy text';

	return new Promise(function (resolve, reject) {

		request(options, function (error, response, body) {
			if (!error) {
//				console.log(response.statusCode);
				if (response.statusCode === 200 || response.statusCode === 201) {

//					console.log('no error');
					// Get token

					//csrfToken = response.headers['x-csrf-token'];

					resolve(response);
				} else if (response.statusCode !== 200) {
					resolve(response);
//					console.log(body);
//					console.log(options);
				}
			} else if (error) {
//				console.log('error');
				resolve(error);
			} else {
//				console.log(body);
				resolve(body);
			}
		});

	});

};