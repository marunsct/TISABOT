module.exports = {

	getFilters: (memory) => {

		return new Promise((resolve, reject) => {
			try {

				var filter = '=';
				var flag;
				//            console.log(memory);
				if (memory.soldto.raw) {
					filter = filter + "PartnNumb eq '" + memory.soldto.raw + "'";
					flag = 'true';
				}

				if (memory.material.raw) {
					if (flag) {
						filter = filter + ' and ' + "Material eq '" + memory.material.raw + "'";
					} else if (!flag) {
						filter = filter + "Material eq '" + memory.material.raw + "'";
						flag = 'true';
					}
				}
				if (memory.date.iso) {
					//                console.log(memory.date.iso);
					var iso = ((memory.date.iso).split("T"))[0].split("-");
					var date = iso[0] + iso[1] + iso[2];
					if (flag) {
						filter = filter + ' and ' + "Date eq '" + date + "'";
					} else if (!flag) {
						filter = filter + "Date eq '" + date + "'";
						flag = 'true';
					}

				}

				resolve(filter);
			} catch (error) {
				reject(error);
			}
		});

	},

	formatReply: (memory, process, oData) => {

		return new Promise((resolve, reject) => {

			var reply;
			var replyCon;

			try {

				if (process === 'createso') {

					replyCon = 'Sales Order: ' + oData.d.Salesdocument + ' is created '; //+ ' for the product ' + memory.product.raw + ' and Quantity ' + memory.quantity.raw;
					reply = [{
						type: 'text',
						content: replyCon
					}, {
						type: 'text',
						content: oData.d.Message
					}];

				} else if (process === 'displayso') {
					//                   console.log("hiiii" + typeof(oData));
					var msg = oData.d.Message;
					//console.log(msg);
					var status = msg.split(':');
					//console.log(status);
					replyCon = 'Sales Order Number: ' + oData.d.Salesdocument + '.'; //+ ' for the product ' + memory.product.raw + ' and Quantity ' + memory.quantity.raw;
					replyCon = replyCon + '\nOverall status: ' + getstats(status[0], 'O');
					replyCon = replyCon + '. \nDelivery status: ' + getstats(status[1], 'D');
					reply = [{
						type: 'text',
						content: replyCon
					}];

				} else if (process === 'displaysoset') {
					var results = oData.d.results;
					var conv = [];
					results.forEach(function (value, index) {
						//                       console.log(value)
						conv[index] = {
							"title": "SO : " + value.Salesdocument,
							"subtitle":
							//"Date : " + value.Date.slice(6, 8) + '.' + value.Date.slice(4, 6) + '.' + value.Date.slice(0, 4) +

								", Sold to : " + value.PartnNumb + ", Material: " + value.Material + ", Quantity : " + value.TargetQty,
							"buttons": [{
								"value": value.Salesdocument,
								"title": "Status",
								"type": "postback"
							}]
						};

					});
					reply = [{
						type: 'carousel',
						content: conv
					}];
					//                  console.log(reply);

				}
				resolve(reply);
			} catch (error) {

				reject(error);

			}

		});

	}
};

const getstats = (stat, pro) =>{

	if (stat === "A") {
		return "Not yet processed";
	} else if (stat === "B") {
		if (pro === 'D') {
			return "Partially Delivered";
		}
		return "Partially processed";
	} else if (stat === "C") {
		if (pro === 'D') {
			return "Fully Delivered";
		}
		return "Completely processed";
	} else if (stat === " ") {
		return "Not Relevant";
	}

};