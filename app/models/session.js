/** 
 * Mongoose Schema for the Sessions
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SessionSchema   = new Schema({
    expiration:{type: Number, required:true},
    token:{type:String, required: true},
    username:{type:String, required:true}
});

module.exports = mongoose.model('Sessions', SessionSchema);