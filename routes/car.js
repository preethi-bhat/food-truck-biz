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
  var request = require("request");

  winston.info(SERVICE_PREFIX + 'Getting the car search response from CRS service');
   
  request('http://localhost:3002/crs/results', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          res.json(data);
          winston.info(SERVICE_PREFIX + 'Got car results : %s', data);
          
      		request({
        			uri: "http://localhost:3100/log/warn",
        			method: "POST",
        			form: data
        		});
      } 
      else {
        winston.error(SERVICE_PREFIX + 'Received an error while getting car results from CRS service. Error is %s', error);
       	res.json('error');
      }
     process.on('uncaughtException', function (err) {
      console.log(err);
      winston.error(SERVICE_PREFIX + 'Received an error while getting car results from CRS service. Error is %s', err);

  });
  })

});


/*
 * POST to adduser.
 */
router.post('/search', function(req, res) {
    //res.msg('Stubbed response');
    winston.info(SERVICE_PREFIX + 'Got a car search request');
});



module.exports = router;

