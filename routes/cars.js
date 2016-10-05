/** 
 * Express Route: /cars
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Car = require('../app/models/car');
var mongoose = require('mongoose');

function isRequestValid(mKeys,req,res){
    var schemaKeys = [];
    Car.schema.eachPath(function(path){
        if(path!="_id" && path!="__v")
            schemaKeys.push(path.toString());
    });

    for (var i = 0, len = Object.keys(mKeys).length; i < len; i++) {
            var element = Object.keys(mKeys)[i].toString();
            if(schemaKeys.indexOf(element)<0){
                    res.status(400).json({
                    "errorCode": "2002", 
                    "errorMessage": util.format("Invalid property(ies) %s given for the car",element), 
                    "statusCode" : "400"
                })
                return 0;
            }
    }
    return 1;
}

router.route('/cars') 
    /**
     * GET call for the car entity (multiple).
     * @returns {object} A list of cars. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Car.find(function(err, cars){
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
                    Car.find(queryParam).exec(function(err,carM){
                        if(carM == undefined){
                             res.status(400).json({
                                "errorCode": "2002", 
                                "errorMessage": util.format("Invalid %s format for the given car",Object.keys(queryParam)), 
                                "statusCode" : "400"
                            })
                            return;
                        }
                        if(carM.length < 1){
                           res.status(404).json({
                             "errorCode": "2001", 
                             "errorMessage": util.format("Car with attribute %s does not exist",JSON.stringify(queryParam)), 
                             "statusCode" : "404"
                            })
                           return;
                        }    
                        else{
                            console.log(err,carM);
                            res.json(carM);
                        }
                    });
                }
                else
                    res.json(cars);
            }
        });
    })
    /**
     * POST call for the car entity.
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /**
         * Add aditional error handling here
         */

        var car = new Car();
        car.license = req.body.license;
        car.doorCount = req.body.doorCount;
        car.make = req.body.make;
        car.model = req.body.model;
        car.driver = mongoose.Types.ObjectId(req.body.driver);

        car.save(function(err){
            if(err){
                if(Object.keys(err).indexOf('errmsg')>0){
                    res.status(400).json({
                        "errorCode": "2005", 
                        "errorMessage": "Given car already exists, Duplicate key error", 
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
                            "errorMessage": util.format("Property '%s' is required for the given car", errorKey), 
                            "statusCode" : "400"
                        })
                        return;
                    }
                    else if(errorObj.name == 'CastError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid %s for the given car", errorKey), 
                            "statusCode" : "400"
                        })
                        return;
                    }
                    else if(errorObj.name == 'ValidatorError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Validation for property %s for the given car failed", errorKey),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                    }
                   else{
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid car object"),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                   }
                }

                res.status(500).send(err);
                return;
            }
            res.status(201).json(car);
        });
    }).
    delete(function(req,res){
        Car.remove({},function(err){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": "Error deleting cars",
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "All Cars Deleted"});
            }
        })
    })


/** 
 * Express Route: /cars/:car_id
 * @param {string} car_id - Id Hash of Car Object
 */
router.route('/cars/:car_id')
    /**
     * GET call for the car entity (single).
     * @returns {object} the car with Id car_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Car.findById(req.params.car_id, function(err, car){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given car with id '%s' does not exist",req.params.car_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(car == null || car == 'undefined'){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given car does not exist"), 
                        "statusCode" : "404"
                    });
                    return;
                }
                else if(Object.keys(car).length<0){
                    res.status(404).send({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given car does not exist"), 
                        "statusCode" : "404"
                    })
                    return;
                }
                else{
                     res.json(car);
                }
            }
        });  
    })
    /**
     * PATCH call for the car entity (single).
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        /**
         * Add extra error handling rules here
         */

        Car.findById(req.params.car_id, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                       car[key] = req.body[key];
                    }
                }

                car.save(function(err){
                    if(err){
                            if(Object.keys(err).indexOf('errors')>0){
                                var errorKey = Object.keys(err.errors)[0];
                                var errorObj = err.errors[errorKey];
                                if(errorObj.kind == 'required'){
                                    res.status(400).json({
                                        "errorCode": "2004", 
                                        "errorMessage": util.format("Property '%s' is required for the given car", errorKey), 
                                        "statusCode" : "400"
                                    });
                                    return;
                                }
                                else if(errorObj.name == 'CastError'){
                                    res.status(400).json({
                                        "errorCode": "2002", 
                                        "errorMessage": util.format("Invalid %s for the given car", errorKey), 
                                        "statusCode" : "400"
                                    });
                                    return;
                                }
                                else if(errorObj.name == 'ValidatorError'){
                                     res.status(400).json({
                                            "errorCode": "2002", 
                                            "errorMessage": util.format("Validation for propoerty %s for the given car failed", errorKey),
                                            "description": errorObj.message, 
                                            "statusCode" : "400"
                                        })
                                    return;
                                }
                            }
                            
                            res.status(500).send({err:err,msg:"test"});
                            return; 
                    }else{
                        res.json({"message" : "Car Updated", "carUpdated" : car});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the car entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Car.remove({
            _id : req.params.car_id
        }, function(err, car){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given car with id '%s' does not exist",req.params.car_id), 
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "Car Deleted"});
            }
        });
    });

module.exports = router;