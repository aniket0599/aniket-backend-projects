var jwt = require('jsonwebtoken');
var bcryptjs = require('bcryptjs');
var User = require('../models/user');

var signup = (req, res) => {
    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 8),
        preferences: req.body.preferences
    });

    user.save().then(data => {
        return res.status(200).send('User Created Successfully');
    }).catch(err => {
        return res.status(500).send('Error in creating user');
    });
}

var signin = (req, res) => {
    User.findOne({ email : req.body.email}).then((user) => {
        var isPasswordValid = bcryptjs.compareSync(req.body.password, user.password)
        if(!isPasswordValid)
        {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var token = jwt.sign({
            id: user.id
        },process.env.API_SECRET, {
            expiresIn : 864000
        });
        return res.status(200).send({
            user : {
                user: user.id,
                email: user.email,
                fullName: user.fullName,
                preferences: user.preferences
            },
            message: 'Login Successful',
            accessToken: token
        }).catch(err => {
            if(err) {
                return res.status(500).send({
                    message: err
                })
            }
        });
    });
};

module.exports = {signup, signin};