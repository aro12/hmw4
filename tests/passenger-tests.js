var supertest = require('supertest'),
assert = require('assert'),
app = require('../server.js');
var mongoose     = require('mongoose');


passengerOne = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-9876345@example.com",
  password: "anypwd12",
  addressLine1: "454 Main Street",
  addressLine2: "aa",
  city: "Anytown",
  state: "AS",
  zip: "83874",
  phoneNumber: "408-555-2737",
};

tokenObj = {
  "username":"aro",
  "password":"aro123"
}

var pasesngerOneId;
var accesToken;

exports.create_token = function(done){
  supertest(app)
  .post("/sessions")
  .send(tokenObj)
  .expect(201)
  .end(function(err,response){
    //console.log(err);
     assert.ok(typeof response.body === 'object');
     assert.ok(response.body.username === "aro");
     accesToken = response.body.token;
     return done();
  })
}


exports.passengers01_delete_all_passenger = function(done){
  supertest(app)
  .delete('/api/passengers')
  .set('token', accesToken)
  .expect(200)
  .end(function(err, response){
     // console.log(err);
     // console.log(response.body);
    return done();
  });
};

exports.passengers01_should_create_passenger = function(done){
  supertest(app)
  .post('/api/passengers')
  .set('token', accesToken)
  .send(passengerOne)
  .expect(201)
  .end(function(err, response){
   // console.log(err);
   // console.log(response.body);
   assert.ok(typeof response.body === 'object');
    pasesngerOneId = response.body._id;
    return done();
  });
};

exports.passengers02_should_get_passenger = function(done){
  supertest(app)
      .get('/api/passengers/' + pasesngerOneId)
      .set('token', accesToken)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
          assert.ok(response.statusCode == 200);
        assert.ok(typeof response.body === 'object');
        return done();
      });
};


exports.passengers03_should_delete_passenger = function(done){
  supertest(app)
      .delete('/api/passengers/' + pasesngerOneId)
      .set('token', accesToken)
      .expect(200)
      .end(function(err, response){
//        console.log(err);
//        console.log(response.body);
//        assert.ok(typeof response.body === 'object');
          assert.ok(response.statusCode == 200);
        return done();
      });
};

exports.passengers04_should_not_get_deleted_passenger = function(done){
    supertest(app)
        .get('/api/passengers/' + pasesngerOneId)
        .set('token', accesToken)
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
            assert.ok(response.statusCode == 404);
//            assert.ok(typeof response.body === 'object');
            return done();
        });
};

exports.passengers05_should_not_get_random_id_passenger = function(done){
    supertest(app)
        .get('/api/passengers/7383883373838')
        .set('token', accesToken)
        .expect(404)
        .end(function(err, response){
//        console.log(err);
//        console.log(response);
//            assert.ok(typeof response.body === 'object');
            assert.ok(response.statusCode == 404);
            return done();
        });
};


exports.passengers06_should_not_create_passenger_missing_email_address = function(done){
    delete passengerOne.emailAddress;
    supertest(app)
        .post('/api/passengers')
        .set('token', accesToken)
        .send(passengerOne)
        .expect(400)
        .end(function(err, response){
   // console.log(err);
   // console.log(response.body);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};

exports.passengers07_should_not_create_passenger_with_long_first_name = function(done){
    passengerOne.firstName = "1234567890123456";
    passengerOne.emailAddress = 'test7383738983@example.com';
    supertest(app)
        .post('/api/passengers')
        .set('token', accesToken)
        .send(passengerOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};

