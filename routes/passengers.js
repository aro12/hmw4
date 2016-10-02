/** 
 * Express Route: /passengers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Passenger = require('../app/models/passenger');

function isRequestValid(mKeys,req,res){
    var schemaKeys = [];
    Passenger.schema.eachPath(function(path){
        if(path!="_id" && path!="__v")
            schemaKeys.push(path.toString());
    });

    for (var i = 0, len = Object.keys(mKeys).length; i < len; i++) {
            var element = Object.keys(mKeys)[i].toString();
            if(schemaKeys.indexOf(element)<0){
                    res.status(400).json({
                    "errorCode": "4002", 
                    "errorMessage": util.format("Invalid propoerty(ies) %s given for the passenger",element), 
                    "statusCode" : "400"
                })
                return 0;
            }
    }
    return 1;
}

router.route('/passengers') 
    /**
     * GET call for the passenger entity (multiple).
     * @returns {object} A list of passengers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
    Passenger.find(function(err, passengers){
        var queryParam = req.query;
            if(err){
                res.status(500).send(err);
            }else{
                if(queryParam != 'undefined' || queryParam !=null)
                {  
                    if(isRequestValid(queryParam,req,res)!=1){
                        return;
                    }

                    Passenger.find(queryParam).exec(function(err,passengerM){
                        if(passengerM == undefined){
                             res.status(400).json({
                                "errorCode": "4002", 
                                "errorMessage": util.format("Invalid %s format for the given passenger",Object.keys(queryParam)), 
                                "statusCode" : "400"
                            })
                            return;
                        }
                        if(passengerM.length < 1)
                           res.status(404).json({
                             "errorCode": "4001", 
                             "errorMessage": util.format("Passenger with attribute %s does not exist",JSON.stringify(queryParam)), 
                             "statusCode" : "404"
                            })
                        else{
                           var fixPassenger = [];
                            for(var index in passengerM){
                                var tempPassenger = passengerM[index];
                                tempPassenger['password'] = null;
                                fixPassenger.push(tempPassenger);
                            }
                            res.json(fixPassenger);
                        }
                    });
                }
                else{
                   var fixPassenger = [];
                    for(var index in passengers){
                        var tempPassenger = passengers[index];
                        tempPassenger['password'] = null;
                        fixPassenger.push(tempPassenger);
                    }
                    res.json(fixPassenger);
                }
            }
         });
    })
    /**
     * POST call for the passenger entity.
     * @param {string} firstName - The first name of the new passenger
     * @param {string} lastName - The last name of the new passenger
     * @param {date} dateOfBirth - The date of birth of the new passenger
     * @param {string} username - The username of the new passenger
     * @param {string} password - The password of the new passenger
     * @param {string} addressLine1 - The address line 1 of the new passenger
     * @param {string} addressLine2 - The address line 2 of the new passenger
     * @param {string} city - The city of the new passenger
     * @param {string} state - The state of the new passenger
     * @param {number} zip - The zip code of the new passenger
     * @param {number} phoneNumber - The phone number of the new passenger
     * @returns {object} A message and the passenger created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if(typeof req.body.firstName === 'undefined'){
            res.status(422).json({"errorCode": "1002", "errorMessage" : util.format("Missing required parameter %s", "firstName"), "statusCode" : "422"});
            return;
        }
        /**
         * Add aditional error handling here
         */

        var passenger = new Passenger();
        passenger.firstName = req.body.firstName;
        passenger.lastName = req.body.lastName;
        passenger.dateOfBirth = req.body.dateOfBirth;
        passenger.username = req.body.username;
        passenger.emailAddress = req.body.emailAddress;
        passenger.password = req.body.password;
        passenger.addressLine1 = req.body.addressLine1;
        passenger.addressLine2 = req.body.addressLine2;
        passenger.city = req.body.city;
        passenger.state = req.body.state;
        passenger.zip = req.body.zip;
        passenger.phoneNumber = req.body.phoneNumber;

        passenger.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(201).json({"message" : "Passenger Created", "passengerCreated" : passenger});
            }
        });
    });

/** 
 * Express Route: /passengers/:passenger_id
 * @param {string} passenger_id - Id Hash of passenger Object
 */
router.route('/passengers/:passenger_id')
    /**
     * GET call for the passenger entity (single).
     * @returns {object} the passenger with Id passenger_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Passenger.findById(req.params.passenger_id, function(err, passenger){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "4001", 
                        "errorMessage": util.format("Given passenger with id '%s' does not exist",req.params.passenger_id), 
                        "statusCode" : "404"
                    });
            }else{
                res.json(passenger);
            }
        });  
    })
    /**
     * PATCH call for the passenger entity (single).
     * @param {string} firstName - The first name of the new passenger
     * @param {string} lastName - The last name of the new passenger
     * @param {date} dateOfBirth - The date of birth of the new passenger
     * @param {string} username - The username of the new passenger
     * @param {string} password - The password of the new passenger
     * @param {string} addressLine1 - The address line 1 of the new passenger
     * @param {string} addressLine2 - The address line 2 of the new passenger
     * @param {string} city - The city of the new passenger
     * @param {string} state - The state of the new passenger
     * @param {number} zip - The zip code of the new passenger
     * @param {number} phoneNumber - The phone number of the new passenger
     * @returns {object} A message and the passenger updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        /**
         * Add aditional error handling here
         */
        Passenger.findById(req.params.passenger_id, function(err, car){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        if(key == 'firstName'){
                            /**
                             * Add extra error handling rules here
                             */
                            passenger.firstName = req.body.firstName;
                        }
                        if(key == 'lastName'){
                            /**
                             * Add extra error handling rules here
                             */
                            passenger.lastName = req.body.lastName;
                        }
                        /**
                         * Repeat for the other properties
                         */
                    }
                }

                passenger.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Passenger Updated", "passengerUpdated" : passenger});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the passenger entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Passenger.remove({
            _id : req.params.passenger_id
        }, function(err, passenger){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Passenger Deleted"});
            }
        });
    });

module.exports = router;