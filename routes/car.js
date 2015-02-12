var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');


var SERVICE_PREFIX = 'Orchestration Service: '

/*
 * GET userlist.
 */
router.get('/results', function(req, res) {


var data ='';
request('http://localhost:3002/crs/results', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        data = JSON.parse(body);

	winston.info(SERVICE_PREFIX + 'Calling offer Service to process results : %s', data);

		request({
  			uri: "http://localhost:3003/offer/results",
  			method: "POST",
  			form: data,
  			},
  			function(error, response, body) {
  				console.log(body);
  				var offerRes = JSON.parse(body);
  				winston.info(SERVICE_PREFIX + 'Got processed  results from offer service: %s', offerRes);

				res.json(offerRes)

  			});
    		} else {
    			   winston.error(SERVICE_PREFIX + 'Received an error while calling CRS Service %s', error);
     			res.json('error');
    		}
  });

		})

module.exports = router;

