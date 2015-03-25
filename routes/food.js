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
