/** 
 * Mongoose Schema for the Entity Driver
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
    firstName: {type: String, minlength:1, maxlength:15, required:true, unique:false},
    lastName: {type: String, minlength:1, maxlength:15, required:true, unique:false},
    emailAddress: {type: String, unique: true, required: true, validate:/[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/},
    password: {type: String, required: true, minlength:8, maxlength:16, unique:false},
    addressLine1: {type: String, maxlength:50, unique:false},
    addressLine2: {type: String, maxlength:50, unique:false},
    city: {type: String, maxlength:50, unique:false},
    state: {type: String, maxlength:2, unique:false},
    zip: {type: String, maxlength:5, unique:false},
    phoneNumber: {type: String, required:true, unique:true,validate:/((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/},
    drivingLicense: {type: String, unique: true, required: true, minlength:8, maxlength:16},
    licensedState: {type: String, required: true, maxlength:2, unique:false},
});

module.exports = mongoose.model('Driver', DriverSchema);