var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');

var SERVICE_PREFIX = 'Orchestration Service: '

router.get('/results', function(req, res) {

  var start = new Date().getTime();
  var data ='';
  var offerRes ='';
  var priceRes ='';

  // ***************** CRS SERVICE *****************
  winston.info(SERVICE_PREFIX + 'Calling CRS service');
  request('http://localhost:3002/crs/results', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        crsRes = JSON.parse(body);
        winston.info(SERVICE_PREFIX + 'Received response from CRS service');

        // ***************** Cluster SERVICE *****************
        winston.info(SERVICE_PREFIX + 'Calling Clustering service');
        request({
            uri: "http://localhost:3003/cluster/results",
            method: "POST",
            form: crsRes,
        }, function(error, response, body) {
          if(error){
            winston.error('Received error from Clustering service: ', error);
            return;
          }
          var offerRes = JSON.parse(body);
          winston.info(SERVICE_PREFIX + 'Received response from Clustering service');

          // ***************** Pricing SERVICE *****************
          winston.info(SERVICE_PREFIX + 'Calling price service');
          request({
              uri: "http://localhost:3005/car/price",
              method: "POST",
              form: offerRes,
          }, function(error, response, pricedResponse) {
            if(error){
              winston.error('Received error from Price Service');
              return;
            }
          var priceRes = JSON.parse(pricedResponse);
          winston.info(SERVICE_PREFIX + 'Received response from price service');

          // ***************** Filter SERVICE *****************
          winston.info(SERVICE_PREFIX + 'Calling filter service');
          request({
              uri: 'http://localhost:3004/car/filter',
              method: 'POST',
              form: priceRes,
            }, function (error, response, filteredResponse) {
                if (error) {
                  next(error);
                  return;
                }
                winston.info(SERVICE_PREFIX + 'Received response from filter service');
                var filteredRes = JSON.parse(filteredResponse);


          // ***************** Sort SERVICE *****************
                winston.info(SERVICE_PREFIX + 'Calling sort service (Python module)');
                var formattedSortRQ = "the_post="+ filteredResponse;
                request({
                    uri: "http://localhost:8000/api/v1/posts/",
                    method: "POST",
                    form: formattedSortRQ,
                }, function(error, response, sortedResponse) {
                  if(error){
                    winston.error('Received error from sort service');
                    return;
                  }
                  var sortResBody = JSON.parse(response.body);
                  var sortRS = JSON.parse(sortResBody.text)

                  winston.info(SERVICE_PREFIX + 'Received response from sort service (Python module) ', sortRS );
          // ***************** END OF SERVICE *****************

                res.json(sortRS);

                var executionTime = new Date().getTime() - start;

                winston.warn(SERVICE_PREFIX + 'Execution time(ms) = ', executionTime);
               });
               });
               });
               });

    } 
    else {
        winston.error(SERVICE_PREFIX + 'Received an error while calling CRS Service %s', error);
        return;
    }
  });

  
  
});

module.exports = router;
