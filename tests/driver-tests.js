var supertest = require('supertest'),
assert = require('assert'),
app = require('../server.js');
var mongoose     = require('mongoose');


driverOne = {
  firstName: "John",
  lastName: "Smith",
  emailAddress: "test-98989@example.com",
  password: "anypwd12",
  addressLine1: "454 Main Street",
  addressLine2: "",
  city: "Anytown",
  state: "AS",
  zip: "83874",
  phoneNumber: "408-555-2737",
  drivingLicense: "D16237356",
  licensedState: "CA"
};

tokenObj = {
  "username":"aro",
  "password":"aro123"
}

var driverOneId;
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


exports.drivers_delete_all_car = function(done){
  supertest(app)
  .delete('/api/drivers')
  .set('token', accesToken)
  .expect(200)
  .end(function(err, response){
     // console.log(err);
     // console.log(response.body);
    return done();
  });
};

exports.drivers01_should_create_driver = function(done){
  supertest(app)
  .post('/api/drivers')
  .set('token', accesToken)
  .send(driverOne)
  .expect(201)
  .end(function(err, response){
   // console.log(err);
   // console.log(response.body);
    assert.ok(typeof response.body === 'object');
    driverOneId = response.body._id;
    console.log(driverOneId);
    return done();
  });
};

exports.drivers02_should_get_driver = function(done){
  supertest(app)
      .get('/api/drivers/' + driverOneId)
      .set('token', accesToken)
      .expect(200)
      .end(function(err, response){
       // console.log(err);
       // console.log(response.body);
          assert.ok(response.statusCode == 200);
        assert.ok(typeof response.body === 'object');
        return done();
      });
};


exports.drivers03_should_delete_driver = function(done){
  supertest(app)
      .delete('/api/drivers/' + driverOneId)
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

exports.drivers04_should_not_get_deleted_driver = function(done){
   console.log(driverOneId);
    supertest(app)
        .get('/api/drivers/' + driverOneId)
        .set('token', accesToken)
        .expect(404)
        .end(function(err, response){
          // console.log(err);
          // console.log(response.body);
            assert.ok(response.statusCode == 404);
//            assert.ok(typeof response.body === 'object');
            return done();
        });
};

exports.drivers05_should_not_get_random_id_driver = function(done){
    supertest(app)
        .get('/api/drivers/7383883373838')
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


exports.drivers06_should_not_create_driver_missing_email_address = function(done){
    delete driverOne.emailAddress;
    supertest(app)
        .post('/api/drivers')
        .set('token', accesToken)
        .send(driverOne)
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

exports.drivers07_should_not_create_driver_with_long_first_name = function(done){
    driverOne.firstName = "1234567890123456";
    driverOne.emailAddress = 'test7383738983@example.com';
    supertest(app)
        .post('/api/drivers')
        .set('token', accesToken)
        .send(driverOne)
        .expect(400)
        .end(function(err, response){
//    console.log(err);
//    console.log(response.body);
            assert.ok(response.statusCode == 400);
            assert.ok(typeof response.body === 'object');
//            driverOneId = response.body._id;
            return done();
        });
};

