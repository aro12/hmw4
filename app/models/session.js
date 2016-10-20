/** 
 * Mongoose Schema for the Sessions
 * @author Aroshi Handa
 * @version 0.1
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SessionSchema   = new Schema({
    token:{type:String, required: true},
});

module.exports = mongoose.model('Sessions', SessionSchema);