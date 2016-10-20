/** 
 * Mongoose Schema for the Entity PaymentAccount
 * @author Aroshi Handa
 * @version 0.0.2
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentAccountSchema   = new Schema({
    //pid:{ type: Schema.Types.ObjectId, required:true},
    accountType: {type: String, maxlength:18, required:true},
    accountNumber: {type: Number, maxlength:18, required:true},
    expirationDate: {type: Date, default: Date.now, required: isPassenger},
    nameOnAccount: {type: String, maxlength:18, required:true},
    bank: {type: String, maxlength:18, required:isDriver}
});

function isDriver(v){
    return false;
}

function isPassenger(v){
    return false;
}

module.exports = mongoose.model('PaymentAccount', PaymentAccountSchema);