var mongoose = require('mongoose');
var util = require('util');

var Session = require('../app/models/session');

var APP_SECRET = "SecretKey";
var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

function requireAuthentication(req,res,next){
     //console.log(req.header("token"));
     if (req.header("token")!="" && req.header("token")!=undefined){
          var tokenObject = {
                token:req.header("token")
           };

           Session.findOne(tokenObject, function(err,authObj){
               if(err){
                   console.log(err);
                   res.status(400).json({
                        "errorCode": "5002", 
                        "errorMessage": util.format("Session not found"), 
                        "statusCode" : "400"
                    })
                   return false;
               }
               else if(authObj == null || Object.keys(authObj).length<1){
                   res.status(400).json({
                        "errorCode": "5002", 
                        "errorMessage": util.format("Token Error, Session not found"), 
                        "statusCode" : "400"
                    
                    })
                    return false;
               }
               else if(('token' in authObj)){
                   
                   var username = "aroshi";
                   var password = "honda";
                   
                   //Split the token into username, expiration, hash
                   var decodeString = base64.decode(authObj.token);
                   var decryptString = CryptoJS.AES.decrypt(decodeString,password);
                   var hashString =  decryptString.toString(CryptoJS.enc.Utf8);
                   var splitString = hashString.split(":");

                   if(splitString.length!=3){
                        res.status(401).json({
                                "errorCode": "5008", 
                                "errorMessage": util.format("Invalid Token, Token has been tampered"), 
                                "statusCode" : "401"
                        })
                        return false;
                   }

                   // console.log(splitString);

                   // Check if token has expired or not
                   var exp = splitString[1].expiration
                   var now =  parseInt(new Date()/1000);
                   // console.log(exp,now,exp-now);
                   if(exp-now<0){
                       console.log("Token Expired");
                       res.status(400).json({
                            "errorCode": "5007", 
                            "errorMessage": util.format("Token Expired"), 
                            "statusCode" : "400"
                        });
                        return false;
                   }

                   // check if hash matchces
                   var checkHash = splitString[2];
                   var oldHash = CryptoJS.HmacSHA1(splitString[0]+":"+splitString[1],"APP");

                   console.log(checkHash, oldHash);
                   if(checkHash == oldHash){
                       return next()
                   }
                   else{
                        res.status(401).json({
                                "errorCode": "5008", 
                                "errorMessage": util.format("Invalid Token, Token has been tampered"), 
                                "statusCode" : "401"
                        })
                        return false;
                   }
               }
                //console.log();
                res.redirect("/");
                return false;
             })
          return false;
     }
    
    res.status(401).json({
        "errorCode": "5001", 
        "errorMessage": util.format("Invalid Token, Authentication Failed"), 
        "statusCode" : "401"
    
    })
    return false;
}

module.exports = requireAuthentication;

