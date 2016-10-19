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
               else if(('expiration' in authObj)){
                   // Check if token has expired or not
                   var exp = authObj.expiration
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

                   // check if token is valid and wasnt tampered
                   // Rehash the expiration & username

                   /////////// -- TESTING TOKEN FOR VALIDITY ///////////////
                   var username = "aroshi";
                   var password = "honda";
            
                   clearString = authObj.username+":"+exp;
                   hashString = CryptoJS.HmacSHA1(clearString,"APP");
                   cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,password).toString();
                   console.log(clearString, hashString,":",cryptString);
                   var token = base64.encode(cryptString);   
                   // check if this token equal to stored token
                   // if(token == authObj.token)

                   /// Trying to decrypt too
                   var decodeString = base64.decode(authObj.token);
                   var decryptString = CryptoJS.AES.decrypt(decodeString,password);
                   //var printTo = cryptString + ":" + decryptString;

                   //console.log(token,authObj.token);
                   if(token == authObj.token)
                        return next();
                    else
                    {
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

