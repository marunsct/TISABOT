exports.Gettok = function (options) {
    const request = require('request');
  //  var csrfToken;
  //  var url = 'http://tyoaw21156.tyoaw21.enet.accenture.com:50000/sap/opu/odata/sap/Y_CHATBOT_SRV_01/';
    
return new Promise(function(resolve,reject){

    request(options, function (error, response, body) { 
        if (!error) {
       console.log(response.statusCode);
        if (response.statusCode === 200 || response.statusCode === 201 ) {

            console.log('no errrorrrrr');
            // Get token
            //csrfToken = response.headers['x-csrf-token'];
            //console.log(response.headers['x-csrf-token']);
            // reply = resptt.GetReply(jbody, memory, 'createpo', csrfToken);
            // resolve(csrfToken);
            resolve(response);
        }
        else if(response.statusCode != 200){
        	console.log(body);
        	console.log(options);
        }
        }
        else if (error) {
            console.log('errorrrrrr');
            reject(error);
        }
        else {
        	console.log(body);
        	reject(body);
        }
    });

});

};