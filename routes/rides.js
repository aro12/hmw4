/** 
 * Express Route: /rides
 * @author Aroshi Handa
 * @version 0.4
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Ride = require('../app/models/ride');
var Car = require('../app/models/car');
var Driver = require('../app/models/driver');
var Passenger = require('../app/models/passenger');
var mongoose = require('mongoose');

// Checks if the ride properties are valid or not
function isRequestValid(mKeys,req,res){
    var schemaKeys = [];
    Ride.schema.eachPath(function(path){
        if(path!="_id" && path!="__v")
            schemaKeys.push(path.toString());
    });

    for (var i = 0, len = Object.keys(mKeys).length; i < len; i++) {
            var element = Object.keys(mKeys)[i].toString();
            if(schemaKeys.indexOf(element)<0){
                    res.status(400).json({
                    "errorCode": "2003", 
                    "errorMessage": util.format("Invalid property %s for the given ride",element), 
                    "statusCode" : "400"
                })
                return 0;
            }
    }
    return 1;
}

router.route('/rides') 
    /**
     * GET call for the ride entity (multiple).
     * @returns {object} A list of rides. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Error handling rules here-
         * Finds a ride with a specific attribute, if it exists 
         * Check if ride with the specified attritute exists or not
         */
        Ride.find(function(err, rides){
            var queryParam = req.query;
        
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                if(queryParam != 'undefined' || queryParam !=null)
                {  
                    if(isRequestValid(queryParam,req,res)!=1){
                        return;
                    }

                    Ride.find(queryParam).exec(function(err,rideM){
                        if(rideM == undefined){
                             res.status(400).json({
                                "errorCode": "2002", 
                                "errorMessage": util.format("Invalid %s format for the given ride",Object.keys(queryParam)), 
                                "statusCode" : "400"
                            })
                            return;
                        }
                        if(rideM.length < 1){
                            res.status(404).json({
                                "errorCode": "2001", 
                                "errorMessage": util.format("ride with attribute %s does not exist",JSON.stringify(queryParam)), 
                                "statusCode" : "404"
                                })
                            return;
                        }
                        else{
                            console.log(err,rideM);
                            res.json(rideM);
                        }
                    });
                }
                else
                    res.json(rides);
            }
        });
    })
    /**
     * POST call for the ride entity.
     * @param {string} license - The license plate of the new ride
     * @param {integer} doorCount - The amount of doors of the new ride
     * @param {string} make - The make of the new ride
     * @param {string} model - The model of the new ride
     * @returns {object} A message and the ride created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /**
         * Error handling here-
         * Checks if the ride already exists or is an invalid ride
         * Checks if another/specific property is needed for the ride
         * Checks if there is an invalid property of the requested ride
         */

        var ride = new Ride();
        ride.rideType = req.body.rideType;
        ride.startPoint.lat = req.body.startPoint.lat;
        ride.startPoint.long = req.body.startPoint.long;
        ride.endPoint.lat = req.body.endPoint.lat;
        ride.endPoint.long = req.body.endPoint.long;
        ride.requestTime = req.body.requestTime;
        ride.pickupTime = req.body.pickupTime;
        ride.dropoffTime = req.body.dropoffTime;
        ride.status = req.body.status;
        ride.fare = req.body.fare;
        ride.driver = mongoose.Types.ObjectId(req.body.driver);
        ride.passenger = mongoose.Types.ObjectId(req.body.passenger);
        ride.car = mongoose.Types.ObjectId(req.body.car);

        ride.save(function(err){
            if(err){
                if(Object.keys(err).indexOf('errmsg')>0){
                    res.status(400).json({
                        "errorCode": "2005", 
                        "errorMessage": "Given ride already exists, Duplicate key error", 
                        "details": err.errmsg,
                        "statusCode" : "400"
                    })
                        return;
                }
                else if(Object.keys(err).indexOf('errors')>0){
                    var errorKey = Object.keys(err.errors)[0];
                    var errorObj = err.errors[errorKey];
                    if(errorObj.kind == 'required'){
                        res.status(400).json({
                            "errorCode": "2004", 
                            "errorMessage": util.format("Property '%s' is required for the given ride", errorKey), 
                            "statusCode" : "400"
                        })
                        return;
                    }
                    else if(errorObj.name == 'CastError'){
                        res.status(400).json({
                            "errorCode": "2003", 
                            "errorMessage": util.format("Invalid %s for the given ride", errorKey), 
                            "statusCode" : "400"
                        })
                        return;
                    }
                    else if(errorObj.name == 'ValidatorError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Validation for property %s for the given ride failed", errorKey),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                    }
                    else{
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid ride object"),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                   }
                }

                res.status(500).send(err);
                return;
            }
            res.json(ride);
        });
    })

    //Delete rides if no error encountered
    .delete(function(req,res){
            Ride.remove({}, function(err, ride){
                if(err){
                    res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": "Error deleting rides",
                        "statusCode" : "404"
                    })
                }else{
                    res.json({"message" : "All rides were deleted"});
                }
            });
    });



/** 
 * Express Route: /rides/:ride_id
 * @param {string} ride_id - Id Hash of ride Object
 */
router.route('/rides/:ride_id')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Error handling rules here-
         * To check if the given ride with the id exists 
         */
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride with id '%s' does not exist",req.params.ride_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(ride == null || ride == 'undefined'){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    });
                    return;
                }
                else if(Object.keys(ride).length<0){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    })
                    return;
                }
                else{
                    res.json(ride);
                }
            }
        });  
    })
    /**
     * PATCH call for the ride entity (single).
     * @param {string} license - The license plate of the new ride
     * @param {integer} doorCount - The amount of doors of the new ride
     * @param {string} make - The make of the new ride
     * @param {string} model - The model of the new ride
     * @returns {object} A message and the ride updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        /**
         * Error handling rules here-
         * Checks if another/specific property is needed for the ride
         * Checks if there is an invalid property/request of the given ride
         */

        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                       ride[key] = req.body[key];
                    }
                }

                ride.save(function(err){
                    if(err){
                        console.log(err);
                            if(Object.keys(err).indexOf('errors')>0){
                                var errorKey = Object.keys(err.errors)[0];
                                var errorObj = err.errors[errorKey];
                                if(errorObj.kind == 'required'){
                                    res.status(400).json({
                                        "errorCode": "2004", 
                                        "errorMessage": util.format("Property '%s' is required for the given ride", errorKey), 
                                        "statusCode" : "400"
                                    });
                                    return;
                                }
                                else if(errorObj.name == 'CastError'){
                                    res.status(400).json({
                                        "errorCode": "2003", 
                                        "errorMessage": util.format("Invalid %s for the given ride", errorKey), 
                                        "statusCode" : "400"
                                    })
                                    return;
                                }
                                else if(errorObj.name == 'ValidatorError'){
                                     res.status(400).json({
                                            "errorCode": "2002", 
                                            "errorMessage": util.format("Validation for propoerty %s for the given ride failed", errorKey),
                                            "description": errorObj.message, 
                                            "statusCode" : "400"
                                        })
                                    return;
                                }
                            }
                            else
                                res.status(500).send(err);
                    }else{
                        res.json({"message" : "Ride Updated", "rideUpdated" : ride});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the ride entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Error handling rules here-
         * Deletes the specific ride if id exists
         */
        Ride.remove({
            _id : req.params.ride_id
        }, function(err, ride){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride with id '%s' does not exist",req.params.ride_id), 
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "Ride Deleted"});
            }
        });
    });

/**
 * Here you must add the routes for the Ride entity
 * /rides/:id/routePoints (POST)
 * /rides/:id/routePoints (GET)
 * /rides/:id/routePoint/current (GET)
 */

router.route('/rides/:ride_id/routePoints')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Error handling rules here-
         * 
         */
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride with id '%s' does not exist",req.params.ride_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(ride == null || ride == 'undefined'){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    });
                    return;
                }
                else if(Object.keys(ride).length<0){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    })
                    return;
                }
                else{
                    if(ride.route == null || ride.route == 'undefined'){
                        res.status(404).send({
                            "errorCode": "1002", 
                            "errorMessage": util.format("Given ride route does not exist"), 
                            "statusCode" : "404"
                        });
                        return;
                    }else{
                        res.json(ride.route);
                    }
                }
            }
        });
    })
    .post(function(req, res){

        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride with id '%s' does not exist",req.params.ride_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(ride == null || ride == 'undefined'){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    });
                    return;
                }
                else if(Object.keys(ride).length<0){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    })
                    return;
                }
                else{
                    ride.route = req.body;
                    ride.save(function(err){
                    if(err){
                        if(Object.keys(err).indexOf('errmsg')>0){
                            res.status(400).json({
                                "errorCode": "2005", 
                                "errorMessage": "Given ride already exists, Duplicate key error", 
                                "details": err.errmsg,
                                "statusCode" : "400"
                            })
                            return;
                        }
                        else if(Object.keys(err).indexOf('errors')>0){
                            var errorKey = Object.keys(err.errors)[0];
                            var errorObj = err.errors[errorKey];
                            if(errorObj.kind == 'required'){
                                res.status(400).json({
                                    "errorCode": "2004", 
                                    "errorMessage": util.format("Property '%s' is required for the given ride", errorKey), 
                                    "statusCode" : "400"
                                })
                                return;
                            }
                            else if(errorObj.name == 'CastError'){
                                res.status(400).json({
                                    "errorCode": "2003", 
                                    "errorMessage": util.format("Invalid %s for the given ride", errorKey), 
                                    "statusCode" : "400"
                                })
                                return;
                            }
                            else if(errorObj.name == 'ValidatorError'){
                                res.status(400).json({
                                    "errorCode": "2002", 
                                    "errorMessage": util.format("Validation for property %s for the given ride failed", errorKey),
                                    "description": errorObj.message, 
                                    "statusCode" : "400"
                                })
                                return;
                            }
                            else{
                                res.status(400).json({
                                    "errorCode": "2002", 
                                    "errorMessage": util.format("Invalid ride object"),
                                    "description": errorObj.message, 
                                    "statusCode" : "400"
                                })
                                return;
                            }
                        }

                        res.status(500).send(err);
                        return;
                    }
                    res.json(ride);
                    })
                }
            }
        });
    });
    router.route('/rides/:ride_id/routePoints/current')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     * Checks if ride is null, undefined 
     * Check if route is null or undefined
     */
    .get(function(req, res){
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride with id '%s' does not exist",req.params.ride_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(ride == null || ride == 'undefined'){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    });
                    return;
                }
                else if(Object.keys(ride).length<0){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given ride does not exist"), 
                        "statusCode" : "404"
                    })
                    return;
                }
                else{
                    if(ride.route == null || ride.route == 'undefined'){
                        res.status(404).send({
                            "errorCode": "1002", 
                            "errorMessage": util.format("Given ride route does not exist"), 
                            "statusCode" : "404"
                        });
                        return;
                    }else{
                        var current = ride.route.slice(-1)[0];
                        res.json(current);
                    }
                }
            }
        });
    });
        

module.exports = router;