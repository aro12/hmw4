/** 
 * Express Route: /
 * @author Aroshi Handa
 * @version 0.4
 */
var express = require('express');
var router = express.Router();
var requireAuthentication = require('./authMiddleware');
var util = require('util');
var mongoose = require('mongoose');

/**
 * Initial route of the API for connection testing purposes
 * @returns {object} A string message.
 */

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to APP Uber CMU!' });   
});

router.all("*",requireAuthentication)

module.exports = router;