module.exports = {
	PORT: process.env.PORT || 5000,
	options: {
		url: "https://dev60759.service-now.com/api/now/table/incident",
		auth: {
			username: 'sn.tisa.user',
			password: 'sntisa123'
		},
		headers: {
			'Authorization': 'Basic ',
			'Content-Type': 'application/json',
			"accept": "application/json"
		}
	}

};