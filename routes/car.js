var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');

var SERVICE_PREFIX = 'Orchestration Service: '
router.get('/results', function(req, res, next) {

  winston.info(SERVICE_PREFIX + 'Getting the car search response from CRS service');
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
    }
    else {
          winston.error(SERVICE_PREFIX + 'Received an error while calling CRS Service %s', error);
          console.log(error);
          //res.json('error');
    }
    
  });


  var sample = {
    
     "searchParam": {
      "destination": "DAL",
      "pickup": "HOU",
      "dropOff": "DAL"
   },
   "searchId": "123",
   "results": [
        {
          "id": "s1",
          "pgoods": [
            {
              "pgoodId": "p1-1",
              "carType": "ECO",
              "carVendor": "Enterprize",
              "price": "250",
              "isOpaque": true,
              "depositType": "Credit"

            }
          ]
        },
        {
          "id": "s2",
          "pgoods": [
            {
              "pgoodId": "p2-1",
              "carType": "COM",
              "carVendor": "Thrifty",
              "price": "200",
              "isOpaque": true,
              "depositType": "Credit"
            }
          ]
        },
        {
          "id": "s3",
          "pgoods": [
            {
              "pgoodId": "p3-1",
              "carType": "ECO",
              "carVendor": "Dollar",
              "price": "150",
              "isOpaque": true,
              "depositType": "Credit"
            }
          ]
        },
        {
          "id": "s4",
          "pgoods": [
            {
              "pgoodId": "p4-1",
              "carType": "ECO",
              "carVendor": "Enterprize",
              "price": "230",
              "isOpaque": false,
              "depositType": "Debit"
            }
          ]
        },
        {
          "id": "s5",
          "pgoods": [
            {
              "pgoodId": "p5-1",
              "carType": "ECO",
              "carVendor": "MidWay",
              "price": "170",
              "isOpaque": false,
              "depositType": "Debit"
            }
          ]
        },
      ]
  }

  request({
    uri: 'http://localhost:3004/filter',
    method: 'POST',
    json: sample
  }, function (error, response, filteredResponse) {
      if (error) {
        next(error);
        return;
      }
      console.log("filtered response..")
      console.log(filteredResponse); 
      res.json(filteredResponse);
     });
});

module.exports = router;

