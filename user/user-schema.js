var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: { type : String , unique : true, required : true, dropDups: true },
  email: { type : String , unique : true, required : true, dropDups: true },
  password: { type : String , required : true }
});
mongoose.model('Userontrack', UserSchema);

module.exports = mongoose.model('Userontrack');