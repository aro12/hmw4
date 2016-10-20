/** 
 * Mongoose Schema for the Entity Car
 * @author Aroshi Handa
 * @version 0.0.1
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarSchema   = new Schema({
    license: {type: String, unique: true, required: true, maxlength:10},
    doorCount: {type: Number, min:1, max:8, required: true, unique:false},
    make:  {type: String, required: true, maxlength:18, unique:false},
    model:  {type: String, required: true, maxlength:18, unique:false},  
    driver: { type: Schema.Types.ObjectId, ref: 'Driver', required:true, unique:false}
});

module.exports = mongoose.model('Car', CarSchema);