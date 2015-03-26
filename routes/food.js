var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');
var https = require('https');
var foodTruck = require('../search/food_search.js');
var foodTruckDataRS = getDataFromApi();

router.post('/localresults', function (req, res) {

    winston.info('Request made to biz service request:', req.body);
    winston.info('Filter criteria: ', req.body.searchQuery)
    
    winston.info('Filtering results by truck name')
    // Filter by truck name
   	var filteredByTruckNameRS = foodTruck.filterByTruckName(foodTruckDataRS, req.body.searchQuery);
   	
   	winston.info('Filtering results by food item')
   	// Filter by food item
    var filteredByFoodItem = foodTruck.filterByFoodItem(foodTruckDataRS, req.body.searchQuery);
    
    winston.info('Combining filtered results')
	// Combine the results into one array
	var filteredResults = filteredByTruckNameRS.concat(filteredByFoodItem);
	
	winston.info('Removing duplicates')
    // Remove duplicates
    var uniqueArray = foodTruck.removeDuplicates(filteredResults);
    
    winston.info('Sorting results')
    var sortedResults;
	if (req.body.userLatitude && req.body.userLongitude) {
		// Sort by distance
		winston.info('Sorting by distance to user')
    	sortedResults = foodTruck.sortByDistance(uniqueArray, req.body.userLatitude, 
    	    									req.body.userLongitude);
	}
	else {    
		winston.info('Sorting alphabetically')
		sortedResults = foodTruck.sortAlphabetically(uniqueArray);
	}

    res.json(sortedResults);

}); // End of router

router.post('/addressresults', function (req, res) {

    winston.info('Request made to biz service request:', req.body);
    winston.info('Resolving user input: ', req.body.searchQuery);
    
    var googleQueryString = "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address="
    						+ req.body.searchQuery;
    						
    var sortedResults;
    var resultsToReturn = {};
    
    request(googleQueryString, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		var geoResolutionRS = JSON.parse(body);
    		if (geoResolutionRS.results.length != 0) {
    			if (geoResolutionRS.results.length > 1) {
    				winston.warn('Geo resolution response was ambiguous. Got ' + 
    							  geoResolutionRS.results.length + ' results. Picking first result');
    			}

    			var lat = geoResolutionRS.results[0].geometry.location.lat;
    			var lng = geoResolutionRS.results[0].geometry.location.lng;
    			winston.info('Geo resolution response = ' + lat + ", " + lng)

    			//todo: cache the response    		
    			winston.info('Filtering out results if it is greater than 1 mile of the lat/lng');
    			filteredResults = foodTruck.filterByDistance(foodTruckDataRS, lat, lng, 1);
    			winston.info('No of food trucks after filtering = ', filteredResults.length);
    		
    			winston.info('Sorting filtered results')
				// Sort by distance
				winston.info('Sorting by distance to address')
    			sortedResults = foodTruck.sortByDistance(filteredResults, lat, lng);

				winston.info('Returning ' + sortedResults.length + ' results');
				resultsToReturn.results = sortedResults;
				resultsToReturn.mapLat = lat;
				resultsToReturn.mapLng = lng;
				res.json(resultsToReturn);
			}
			else {
				winston.error('Could not resolve user input');
				res.json(resultsToReturn);
			}
  		}
	})

}); // End of router


function getDataFromApi() {
	request('https://data.sfgov.org/resource/rqzj-sfat.json', function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		foodTruckDataRS = JSON.parse(body); 
    		winston.info('No. of food trucks got from response = ' + foodTruckDataRS.length)
    		//todo: cache the response
  		}
	})
}



module.exports = router;
