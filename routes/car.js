var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');

var SERVICE_PREFIX = 'Orchestration Service: '

router.get('/results', function(req, res) {

  
  var data ='';
  var offerRes ='';
  var priceRes ='';

  // ***************** CRS SERVICE *****************
  winston.info(SERVICE_PREFIX + 'Calling CRS service');
  request('http://localhost:3002/crs/results', function (error, response, crsbody) {
    if (!error && response.statusCode == 200) {
        //crsRes = JSON.parse(body);
        winston.info(SERVICE_PREFIX + 'Received response from CRS service');

        // ***************** Cluster SERVICE *****************
        var start = new Date().getTime();
        winston.info(SERVICE_PREFIX + 'Calling Clustering service');
        request({
            uri: "http://localhost:3003/cluster/results",
            method: "POST",
            body: crsbody,
        }, function(error, response, clusterbody) {
          if(error){
            winston.error('Received error from Clustering service: ', error);
            return;
          }
          var offerRes = JSON.parse(clusterbody);
          winston.info(SERVICE_PREFIX + 'Received response from Clustering service');
          var endCluster = new Date().getTime();

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

          var startFilter = new Date().getTime();
          var priceRes = JSON.parse(pricedResponse);
          winston.info(SERVICE_PREFIX + 'Received response from price service');

          // ***************** Winner selection SERVICE *****************
          winston.info(SERVICE_PREFIX + 'Calling winner selection service');
          request({
              uri: "http://localhost:3006/car/winner",
              method: "POST",
              form: priceRes,
          }, function(error, response, winnerResponse) {
            if(error){
              winston.error('Received error from winner selection Service');
              return;
            }

          var startFilter = new Date().getTime();
          var winnerSelectionResp = JSON.parse(winnerResponse);
          winston.info(SERVICE_PREFIX + 'Received response from winner selection service');


          // ***************** Filter SERVICE *****************
          winston.info(SERVICE_PREFIX + 'Calling filter service');
          request({
              uri: 'http://localhost:3004/car/filter',
              method: 'POST',
              form: winnerSelectionResp,
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

                var endServiceCalls = new Date().getTime();
                var totalExecutionTime = (endCluster - start) + (endServiceCalls - startFilter); 

                winston.warn(SERVICE_PREFIX + 'Execution time excluding CRS and Pricing (ms) = ', totalExecutionTime);
               });
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
