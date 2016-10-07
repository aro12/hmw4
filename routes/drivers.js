/** 
 * Express Route: /drivers
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var Driver = require('../app/models/driver');

function isRequestValid(mKeys,req,res){
    var schemaKeys = [];
    Driver.schema.eachPath(function(path){
        if(path!="_id" && path!="__v")
            schemaKeys.push(path.toString());
    });

    for (var i = 0, len = Object.keys(mKeys).length; i < len; i++) {
            var element = Object.keys(mKeys)[i].toString();
            if(schemaKeys.indexOf(element)<0){
                    res.status(400).json({
                    "errorCode": "2002", 
                    "errorMessage": util.format("Invalid property(ies) %s given for the driver",element), 
                    "statusCode" : "400"
                })
                return 0;
            }
    }
    return 1;
}

router.route('/drivers') 
    /**
     * GET call for the driver entity (multiple).
     * @returns {object} A list of drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.find(function(err, drivers){
            var queryParam = req.query;
            if(err){
                res.status(500).send(err);
            }else{
                if(queryParam != 'undefined' || queryParam !=null)
                {  
                    if(isRequestValid(queryParam,req,res)!=1){
                        return;
                    }
                    Driver.find(queryParam).exec(function(err,driverM){
                        if(driverM == undefined || driverM == null){
                             res.status(404).json({
                                "errorCode": "2002", 
                                "errorMessage": util.format("Invalid %s format for the given driver",Object.keys(queryParam)), 
                                "statusCode" : "404"
                            })
                            return;
                        }
                        else if(driverM.length < 1){
                           res.status(404).json({
                             "errorCode": "2001", 
                             "errorMessage": util.format("Driver with attribute %s does not exist",JSON.stringify(queryParam)), 
                             "statusCode" : "404"
                            })
                        }   
                        else{
                           var fixDrivers = [];
                            for(var index in driverM){
                                var tempDriver = driverM[index];
                                tempDriver['password'] = null;
                                fixDrivers.push(tempDriver);
                            }
                            res.json(fixDrivers);
                        }
                    });
                }
                else{
                    var fixDrivers = [];
                    for(var index in drivers){
                        var tempDriver = drivers[index];
                        tempDriver['password'] = null;
                        fixDrivers.push(tempDriver);
                    }
                    res.json(fixDrivers);
                }
            }
        });
    })
    /**
     * POST call for the driver entity.
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /**
         * Add aditional error handling here
         */

        var driver = new Driver();
        driver.firstName = req.body.firstName;
        driver.lastName = req.body.lastName;
        driver.dateOfBirth = req.body.dateOfBirth;
        driver.licenseType = req.body.licenseType;
        driver.username = req.body.username;
        driver.emailAddress = req.body.emailAddress;
        driver.password = req.body.password;
        driver.addressLine1 = req.body.addressLine1;
        driver.addressLine2 = req.body.addressLine2;
        driver.city = req.body.city;
        driver.state = req.body.state;
        driver.zip = req.body.zip;
        driver.phoneNumber = req.body.phoneNumber;
        driver.drivingLicense = req.body.drivingLicense;
        driver.licensedState = req.body.licensedState;

        driver.save(function(err){
            if(err){
                if(Object.keys(err).indexOf('errmsg')>0){
                    res.status(400).json({
                        "errorCode": "2005", 
                        "errorMessage": "Given driver already exists, Duplicate key error", 
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
                            "errorMessage": util.format("Property '%s' is required for the given driver", errorKey), 
                            "statusCode" : "400"
                        });
                        return;
                    }
                    else if(errorObj.name == 'CastError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid %s for the given driver", errorKey), 
                            "statusCode" : "400"
                        });
                        return;
                    }
                    else if(errorObj.name == 'ValidatorError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Validation for property %s for the given driver failed", errorKey),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                    }
                   else{
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid driver object"),
                            "description": errorObj.message, 
                            "statusCode" : "400"
                        })
                        return;
                   }
                }
                else
                    res.status(500).send(err);
            }else{
                res.status(201).json(driver);
            }
        });
    }).
    delete(function(req,res){
        Driver.remove({},function(err){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": "Error deleting drivers",
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "All Drivers Deleted"});
            }
        })
    })

/** 
 * Express Route: /drivers/:driver_id
 * @param {string} driver_id - Id Hash of driver Object
 */
router.route('/drivers/:driver_id')
    /**
     * GET call for the driver entity (single).
     * @returns {object} the driver with Id driver_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                //res.status(500).send(err);
                    res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given driver with id '%s' does not exist",req.params.driver_id), 
                        "statusCode" : "404"
                    })
            }else{
                if(driver == null){
                    res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given driver with id '%s' does not exist",req.params.driver_id), 
                        "statusCode" : "404"
                    });
                    return;
                }
                var tempDriver = driver;
                tempDriver['password'] = null;
                res.json(tempDriver);
            }
        });  
    })
    /**
     * PATCH call for the driver entity (single).
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){        
        /**
         * Add aditional error handling here
         */

        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        driver[key] = req.body[key];
                    }
                }

                driver.save(function(err){
                    if(err){
                        //console.log(err);
                            if(Object.keys(err).indexOf('errors')>0){
                                var errorKey = Object.keys(err.errors)[0];
                                var errorObj = err.errors[errorKey];
                                if(errorObj.kind == 'required'){
                                    res.status(422).json({
                                        "errorCode": "2004", 
                                        "errorMessage": util.format("Property '%s' is required for the given driver", errorKey), 
                                        "statusCode" : "422"
                                    })
                                }
                                else if(errorObj.name == 'CastError'){
                                    res.status(400).json({
                                        "errorCode": "2002", 
                                        "errorMessage": util.format("Invalid %s for the given driver", errorKey), 
                                        "statusCode" : "400"
                                    })
                                }
                            }
                            else
                                res.status(500).send(err);
                    }else{
                        res.json({"message" : "Driver Updated", "driverUpdated" : driver});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the driver entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.remove({
            _id : req.params.driver_id
        }, function(err, driver){
            if(err){
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given driver with id '%s' does not exist",req.params.driver_id), 
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "Driver Deleted"});
            }
        });
    });

module.exports = router;