var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');
var async = require('async');
var GeoPoint = require('geopoint')
var foodTruck = module.exports = {};

/**
* This method will filter the food truck data array if the query string is present in
* the applicant name
* @param foodTruckData The array of food truck data
* @param searchQuery The string to look for
* @return An array where all the applicant name contains the search string
*/
foodTruck.filterByTruckName = function(inputArray, searchQuery) {
    var filteredArray = inputArray.filter(function(item, pos) {
    	var item_applicant_lower = item.applicant.toLowerCase();
    	var query_lower = searchQuery.toLowerCase();
    	// Return true if the applicant name contains the query string
    	return item_applicant_lower.indexOf(query_lower) > -1;
	})
	
	return filteredArray;
}

/**
* This method will filter the food truck data array if the query string is present in
* the food item
* @param foodTruckData The array of food truck data
* @param searchQuery The string to look for
* @return An array where all search string is present in the food items
*/
foodTruck.filterByFoodItem = function(inputArray, searchQuery) {
    var filteredArray = inputArray.filter(function(item, pos) {
    	if (item.fooditems) {
    		var item_fooditems_lower = item.fooditems.toLowerCase();
    		var query_lower = searchQuery.toLowerCase();
    		// Return true if the applicant name contains the query string
    		return item_fooditems_lower.indexOf(query_lower) > -1;
    	}
    	else {
    		// No food items present for this element.
    		return false;
    	}
	})
	
	return filteredArray;
}

/**
* This method will filter the food truck data array based on distance
* If a food truck is greater than a certain distance away from the given location, then
* it will be filtered out
* @param foodTruckData The array of food truck data
* @param lat Latitude
* @param lng Longitude
* @param miles distance to filter based on
* @return An array where all trucks are within "miles" miles from "lat/lng"
*/
foodTruck.filterByDistance = function(inputArray, lat, lng, miles) {
    var filteredArray = inputArray.filter(function(item, pos) {
    	if (item.latitude && item.longitude) {
    		dist = foodTruck.distance(item.latitude, item.longitude, lat, lng);
    		return (dist <= miles);
    	}
    	else {
    		// Does not have a lat/long
    		return false;
    	}
	})
	
	return filteredArray;
}

/**
* This method will remove all duplicates from the given array
* @param inputArray The input array which might contain duplicates
* @return An array without any duplicates
*/
foodTruck.removeDuplicates = function(inputArray) {
    var uniqueArray = inputArray.filter(function(elem, pos) {
    	return inputArray.indexOf(elem) == pos;
	})
	
	return uniqueArray;
}

/**
* This method will sort the given array in ascending order based on the distance 
* Trying out async sortBy functionally
* between the user's location and the truck's location 
* @param foodTruckData The input array which contains the food truck data
* @param userLatitude	The user's current location latitude
* @param userLongitude 	The user's current location longitude
* @return An sorted array in ascending order by distance 
*/
foodTruck.sortByDistance = function(foodTruckData, userLatitude, userLongitude) {
	var sortedResults;
	var LARGE_NUMBER = 9999;
    //ascending order
	async.sortBy(foodTruckData, function(x, callback) {
		dist = LARGE_NUMBER;
		if (x.latitude && x.longitude) {
			dist = foodTruck.distance(x.latitude, x.longitude, userLatitude, userLongitude);
			winston.log("Data=" + x.location.latitude + ", " + x.location.longitude +
						 ", " + userLatitude + ", " + userLongitude + ", distance =" +
						 dist);
			x.distance = Number((dist).toFixed(1));

		}
		else {
			x.distance = "Unavailable"
		}
		
   	 	callback(null, dist);
	}, function(err,result){
    	//result callback
    	sortedResults = result
	});
	
	return sortedResults;
}

/**
* This method will sort the given array in alphabetical order based on food truck name
* Trying out array sort functionality
* @param foodTruckData The input array which contains the food truck data
* @return An sorted array in  alphabetical order 
*/
foodTruck.sortAlphabetically = function(foodTruckData) {
	var sortedResults = foodTruckData;
	sortedResults.sort(function(a, b){
    	if(a.applicant < b.applicant) return -1;
    	if(a.applicant > b.applicant) return 1;
    	return 0;
	})
	
	return sortedResults;
}

/**
* This method will return the distance between two geo points in miles
* @param lat1	Latitude of first geo point
* @param lon1	Longitude of first geo point
* @param lat2	Latitude of second geo point
* @param lon3	Longitude of second geo point
* @return distance between two geo points lat/long in miles 
*/
foodTruck.distance = function(lat1, lon1, lat2, lon2, unit) {
    point1 = new GeoPoint(parseFloat(lat1), parseFloat(lon1));
    point2 = new GeoPoint(parseFloat(lat2), parseFloat(lon2));
    dist = point1.distanceTo(point2);
    
    return dist
}

module.exports = foodTruck;
