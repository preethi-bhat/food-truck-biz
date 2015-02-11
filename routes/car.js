var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/results', function(req, res) {
    /*var carResults = {"results":[
        {"carType":"Economy", "carVendor":"Hertz", "price":"$10"}, 
        {"carType":"Compact",    "carVendor":"Enterprise", "price":"$20"},
        {"carType":"Mid Size", "carVendor":"Thrifty", "price":"$30"}
    ]} */
   var cars = {
   	
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
	            "depositType": "Credit"
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
	            "depositType": "Credit"
	          }
	        ]
	      },
	    ]
	 };

    res.json(cars);
});


/*
 * POST to adduser.
 */
router.post('/search', function(req, res) {
    //res.msg('Stubbed response');
});



module.exports = router;

