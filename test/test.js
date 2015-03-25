var assert = require("assert")
var foodTruck = require('../search/food_search.js');
var foodTruckTestData = require('./food_truck_test_data.json');


describe('food truck finder logic', function() {
	describe('#filterByTruckName()', function(){
    	it('should return non empty list when the value is present in the applicant name', function(){
    		var filteredData = foodTruck.filterByTruckName(foodTruckTestData, 'cup') 
			assert.equal(1, filteredData.length);
    	})
  	})
  	
  	describe('#filterByTruckName_Empty()', function(){
    	it('should return  empty list when the value is not present in the applicant name', function(){
    		var filteredData = foodTruck.filterByTruckName(foodTruckTestData, 'TEST') 
			assert.equal(0, filteredData.length);
    	})
  	})
  	
  	describe('#filterByFoodItem()', function(){
    	it('should return non empty list when the value is present in the food category', function(){
    		var filteredData = foodTruck.filterByFoodItem(foodTruckTestData, 'cheese') 
			assert.equal(2, filteredData.length);
    	})
  	})
  	
  	describe('#filterByFoodItem_Empty()', function(){
    	it('should return empty list when the value is not present in the food category', function(){
    		var filteredData = foodTruck.filterByFoodItem(foodTruckTestData, 'TEST') 
			assert.equal(0, filteredData.length);
    	})
  	})
  	
  	describe('#removeDuplicates()', function(){
    	it('should return a list with all duplicates removed', function(){
    		var filteredData = foodTruck.removeDuplicates([1, 2, 3, 1, 2, 3, 1, 2, 4, 5]) 
			assert.equal(5, filteredData.length);
    	})
  	})
  	
  	describe('#removeDuplicates_no_duplicates()', function(){
    	it('should return a list with all duplicates removed', function(){
    		var filteredData = foodTruck.removeDuplicates([1, 2, 3, 4, 5]) 
			assert.equal(5, filteredData.length);
    	})
  	})
  	
  	describe('#sortByDistance()', function(){
    	it('should return a list sorted alphabetically based on distance from user', function(){
    		var filteredData = foodTruck.sortByDistance(foodTruckTestData, 37.7795671, -122.4545801) 
			assert.equal("Cupkates Bakery, LLC", filteredData[0].applicant)
    		assert.equal("Missing Link SF", filteredData[1].applicant)
    		assert.equal("Cheese Gone Wild", filteredData[2].applicant)
    		assert.equal("Mini Mobile Food Catering", filteredData[3].applicant)
    		assert.equal("Steve\'s Mobile Deli", filteredData[4].applicant)

			assert.equal(5, filteredData.length); // Make sure nothing is filtered out
    	})
  	})
  	
  	describe('#sortAlphabetically()', function(){
    	it('should return a list sorted alphabetically based on food truck name', function(){
    		var filteredData = foodTruck.sortAlphabetically(foodTruckTestData)
    		assert.equal("Cheese Gone Wild", filteredData[0].applicant)
    		assert.equal("Cupkates Bakery, LLC", filteredData[1].applicant)
    		assert.equal("Mini Mobile Food Catering", filteredData[2].applicant)
    		assert.equal("Missing Link SF", filteredData[3].applicant)
    		assert.equal("Steve\'s Mobile Deli", filteredData[4].applicant)

			assert.equal(5, filteredData.length); // Make sure nothing is filtered out
    	})
  	})
  	
  	
  	describe('#distance()', function(){
    	it('should return the distance between two lat/long in miles', function(){
    		var distance = foodTruck.distance(37.7901490874965, -122.398658184594,
    		37.7795671, -122.4545801) 
    		
			assert.equal(3.14,  Number((distance).toFixed(3)));
    	})
  	})
  	
})