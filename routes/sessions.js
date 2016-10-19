var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose = require('mongoose');

var Session = require('../app/models/session');
var APP_SECRET = "SecretKey";

var CryptoJS=require("crypto-js");
var base64=require("js-base64").Base64;

router.route('/')
    .get(function(req, res){
        // To display all sessions
        // For debug only
         Session.find(function(err, sessions){
             if(err)
                return;
            res.status(200).json(sessions);  
        });
    })
    .post(function(req, res){

        var username = "aroshi";
        var password = "honda";

        // If username & password is missing 
        if(Object.keys(req.body).indexOf("username")<0 && Object.keys(req.body).indexOf("password")<0)
        {
             res.status(400).json({
                "errorCode": "5006", 
                "errorMessage": util.format("Username or Password not given"), 
                "statusCode" : "400"
            })
            return;
        }

        //Invalid username & password
        if(req.body.username != username || req.body.password != password)
        {
           res.status(400).json({
                "errorCode": "5007", 
                "errorMessage": util.format("Invalid Username & Password"), 
                "statusCode" : "400"
            })
            return; 
        }

        expiration = (parseInt(new Date()/1000) + 3600);
        clearString = username+":"+expiration;

        hashString = CryptoJS.HmacSHA1(clearString,"APP");
        cryptString = CryptoJS.AES.encrypt(clearString+":"+hashString,password).toString();
       
        console.log(clearString, hashString,":",cryptString);
        response = {token: base64.encode(cryptString)}
        // console.log("token", response)
        
        var mSession = new Session();
        mSession.token = response.token;

        mSession.save(function(err,lSession){
            if(err){
                console.log(err);
                res.status(400).json(err);
                return;
            }
            res.status(201).json(lSession);
            return;
        });
    });

module.exports = router;