/** 
 * Mongoose Schema for the Sessions
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SessionSchema   = new Schema({
    token:{type:String, required: true},
});

module.exports = mongoose.model('Sessions', SessionSchema);