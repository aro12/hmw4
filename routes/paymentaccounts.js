/** 
 * Express Route: /paymentaccounts
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var PaymentAccount = require('../app/models/paymentaccount');

function isRequestValid(mKeys,req,res){
    var schemaKeys = [];
    PaymentAccount.schema.eachPath(function(path){
        if(path!="_id" && path!="__v")
            schemaKeys.push(path.toString());
    });

    for (var i = 0, len = Object.keys(mKeys).length; i < len; i++) {
            var element = Object.keys(mKeys)[i].toString();
            if(schemaKeys.indexOf(element)<0){
                    res.status(400).json({
                    "errorCode": "2002", 
                    "errorMessage": util.format("Invalid property(ies) %s given for the payment account",element), 
                    "statusCode" : "400"
                })
                return 0;
            }
    }
    return 1;
}

router.route('/paymentaccounts') 
    /**
     * GET call for the paymentAccount entity (multiple).
     * @returns {object} A list of paymentAccounts. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.find(function(err, PaymentAccounts){
        var queryParam = req.query;
            if(err){
                res.status(500).send(err);
            }else{
                if(queryParam != 'undefined' || queryParam !=null)
                {  
                    if(isRequestValid(queryParam,req,res)!=1){
                        return;
                    }

                    PaymentAccount.find(queryParam).exec(function(err,PaymentAccountM){
                        if(PaymentAccountM == undefined){
                             res.status(400).json({
                                "errorCode": "4002", 
                                "errorMessage": util.format("Invalid %s format for the given PaymentAccount",Object.keys(queryParam)), 
                                "statusCode" : "400"
                            })
                            return;
                        }
                        if(PaymentAccountM.length < 1)
                           res.status(404).json({
                             "errorCode": "4001", 
                             "errorMessage": util.format("PaymentAccount with attribute %s does not exist",JSON.stringify(queryParam)), 
                             "statusCode" : "404"
                            })
                        else{
                           var fixPaymentAccount = [];
                            for(var index in PaymentAccountM){
                                var tempPaymentAccount = PaymentAccountM[index];
                                tempPaymentAccount['password'] = null;
                                fixPaymentAccount.push(tempPaymentAccount);
                            }
                            res.json(fixPaymentAccount);
                        }
                    });
                }
                else{
                   var fixPaymentAccount = [];
                    for(var index in PaymentAccounts){
                        var tempPaymentAccount = PaymentAccounts[index];
                        tempPaymentAccount['password'] = null;
                        fixPaymentAccount.push(tempPaymentAccount);
                    }
                    res.json(fixPaymentAccount);
                }
            }
         });
    })
    /**
     * POST call for the paymentAccount entity.
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        if(typeof req.body.accountType === 'undefined'){
            res.status(422).json({"errorCode": "1002", "errorMessage" : util.format("Missing required parameter %s", "accountType"), "statusCode" : "422"});
            return;
        }
        /**
         * Add aditional error handling here
         */

        var paymentAccount = new PaymentAccount();
        paymentAccount.accountType = req.body.accountType;
        paymentAccount.accountNumber = req.body.accountNumber;
        paymentAccount.expirationDate = req.body.expirationDate;
        paymentAccount.nameOnAccount = req.body.nameOnAccount;
        paymentAccount.bank = req.body.bank;

        paymentAccount.save(function(err){
           if(err){
                if(Object.keys(err).indexOf('errmsg')>0){
                    res.status(400).json({
                        "errorCode": "2005", 
                        "errorMessage": "Given PaymentAccount already exists, Duplicate key error", 
                        "details": err.errmsg,
                        "statusCode" : "400"
                    })
                }
                else if(Object.keys(err).indexOf('errors')>0){
                    var errorKey = Object.keys(err.errors)[0];
                    var errorObj = err.errors[errorKey];
                    if(errorObj.kind == 'required'){
                        res.status(422).json({
                            "errorCode": "2004", 
                            "errorMessage": util.format("Property '%s' is required for the given PaymentAccount", errorKey), 
                            "statusCode" : "422"
                        })
                    }
                    else if(errorObj.name == 'CastError'){
                        res.status(400).json({
                            "errorCode": "2002", 
                            "errorMessage": util.format("Invalid %s for the given PaymentAccount", errorKey), 
                            "statusCode" : "400"
                        })
                    }
                }
                else
                    res.status(500).send(err);
            }else{
                res.status(201).json({"message" : "PaymentAccount Created", "paymentAccountCreated" : paymentAccount});
            }
        });
    });

/** 
 * Express Route: /paymentaccounts/:paymentaccount_id
 * @param {string} paymentaccount_id - Id Hash of PaymentAccount Object
 */
router.route('/paymentaccounts/:paymentaccount_id')
    /**
     * GET call for the paymentAccount entity (single).
     * @returns {object} the paymentaccount with Id paymentaccount_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){        
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paymentAccount){
            if(err){
                //res.status(500).send(err);
                 res.status(404).json({
                        "errorCode": "4001", 
                        "errorMessage": util.format("Given passenger with id '%s' does not exist",req.params.paymentaccount_id), 
                        "statusCode" : "404"
                    });
            }else{
                res.json(paymentAccount);
            }
        });  
    })
    /**
     * PATCH call for the paymentAccount entity (single).
     * @param {string} accountType - The account type of the new paymentAccount
     * @param {integer} accountNumber - The account number of the new paymentAccount
     * @param {date} expirationDate - The expiration date of the new paymentAccount
     * @param {string} nameOnAccount - The name on account of the new paymentAccount
     * @param {string} bank - The bank of the new paymentAccount
     * @returns {object} A message and the paymentAccount created. (201 Status Code)
     * @returns {object} A message and the paymentaccount updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){
        if(typeof req.body.accountType === 'undefined'){
            res.status(422).json({"errorCode": "1002", "errorMessage" : util.format("Missing required parameter %s", "accountType"), "statusCode" : "422"});
            return;
        }
        /**
         * Add aditional error handling here
         */

        PaymentAccount.findById(req.params.paymentaccount_id, function(err, paccount){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                       paccount[key] = req.body[key];
                    }
                }

                paymentaccount.save(function(err){
                    if(err){
                        //console.log(err);
                            if(Object.keys(err).indexOf('errors')>0){
                                var errorKey = Object.keys(err.errors)[0];
                                var errorObj = err.errors[errorKey];
                                if(errorObj.kind == 'required'){
                                    res.status(422).json({
                                        "errorCode": "2004", 
                                        "errorMessage": util.format("Property '%s' is required for the given paymentAccount", errorKey), 
                                        "statusCode" : "422"
                                    })
                                }
                                else if(errorObj.name == 'CastError'){
                                    res.status(400).json({
                                        "errorCode": "2002", 
                                        "errorMessage": util.format("Invalid %s for the given paymentAccount", errorKey), 
                                        "statusCode" : "400"
                                    })
                                }
                            }
                            else
                                res.status(500).send(err);
                    }else{
                        res.json({"message" : "PaymentAccount Updated", "paymentAccountUpdated" : paymentAccount});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the paymentaccount entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){  
        /**
         * Add extra error handling rules here
         */
        PaymentAccount.remove({
            _id : req.params.paymentaccount_id
        }, function(err, paymentaccount){
            if(err){
                //res.status(500).send(err);
                res.status(404).json({
                        "errorCode": "1002", 
                        "errorMessage": util.format("Given payment account with id '%s' does not exist",req.params.paymentaccount_id), 
                        "statusCode" : "404"
                    })
            }else{
                res.json({"message" : "PaymentAccount Deleted"});
            }
        });
    });

module.exports = router;