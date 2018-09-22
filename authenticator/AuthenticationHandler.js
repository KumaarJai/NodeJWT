var express = require('express');
var router = express.Router();
var date= require('date-and-time');
var bodyParser = require('body-parser');
var VerifyToken = require('./verifyWebToken');
var User = require('../user/user-schema');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config/application-properties'); // get encryption key


// ------------ APIs ------------

router.post('/login', async function(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }) 
        //console.log(req.body.password, user.password);
        if (!user) return res.status(404).send('No user found.');

        const passwordValid = bcrypt.compare(req.body.password, user.password)
        //console.log(req.body.password, user.password);
        if(!passwordValid) res.status(401).send({ auth: false, token: null });
        //console.log('Is password valid : ' + passwordValid);
        
        const token = await jwt.sign({ id: user._id }, config.encryptionKey, {
                expiresIn: 86400 // expires in 86400 seconds = 24 hours
              })
        res.status(200).send({ auth: true, token: token });  
    } catch (error) {
        res.status(500).send('Login Failed : '+ error);
    }  


});

 
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});


router.post('/register', async function(req, res) {
    console.log(date.format(new Date(), 'YYYY/MM/DD HH:mm:ss:SSS') +' --> New request recieved for '+req.body.name);

    try {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
          })

          var token = await jwt.sign({ id: user._id }, config.encryptionKey, {
            expiresIn: 86400
          });

          res.status(200).send({ auth: true, name: user.name, token: token });
    } catch (error) {
        //throw ('Registration failed ' + error)
        res.status(500).send({ auth: false, name: req.body.name, token: null, msg: error });
    }
});

router.get('/profile', VerifyToken, async function(req, res, next) {
    try {
        const user = await User.findById(req.userId, { password: 0 })
        console.log(req.userId)
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Authenticate Failed : '+ error);
        //if (error) return res.status(500).send("There was a problem finding the user.");
    }

});



module.exports = router;