var express = require('express');
var app = express();
var port = process.env.PORT || 3500;
global.__root   = __dirname + '/'; 



// ------MongoDB mlab connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://ajay:akr007007@ds247330.mlab.com:47330/crystalark', { useNewUrlParser: true });

mongoose.connection.on('connected',() =>{
    console.log('Mongo DB Connection successful...');
});
mongoose.connection.on('error',(err) =>{
    if(err){
        console.log('Error connecting to MOngoDB : '+err);
    }
});


// ------Routes configuration
var UserRoutes = require(__root + 'user/UserService');
app.use('/api/user', UserRoutes);
var AuthenticatorRoutes = require(__root + 'authenticator/AuthenticationHandler');
app.use('/api/auth', AuthenticatorRoutes);


// ------ test API
app.get('/api', function (req, res) {
    res.status(200).send('Hi there, I am working...');
  });

// ----- server start
app.listen(port, function() {
    console.log('Express server listening on port : ' + port);
  });

  //Initial commit