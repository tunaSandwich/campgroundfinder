var express = require('express');
var router = express.Router();


/* GET map page. */
router.get('/', function(req, res, next) {
  res.render('map', {});
});


module.exports = router;
