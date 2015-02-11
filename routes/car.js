var express = require('express');
var router = express.Router();
var request = require('request');

/*
 * GET userlist.
 */
router.get('/results', function(req, res) {

var data ='';
var request = require("request");
 
request('http://localhost:3002/crs/results', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        data = JSON.parse(body);
        res.json(data);
        
		request({
  			uri: "http://localhost:3100/log/warn",
  			method: "POST",
  			form: data
  		});
    } else {
     	res.json('error');
    }
})

});


/*
 * POST to adduser.
 */
router.post('/search', function(req, res) {
    //res.msg('Stubbed response');
});



module.exports = router;

