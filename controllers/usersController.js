const User = require('../models/usersModel');
const bodyParser = require('body-parser');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const baseApiUrl = '/api/';


    // get all users
    app.get(baseApiUrl + 'users', (req, res) => {

        User.find({}, (err, users) => {
            res.send( { "status": 200, "Result": users } );
        });

    });

    // get user by id
    app.get(baseApiUrl + 'user/:_id', (req, res) => {

        User.findById( { _id: req.params._id }, (err, user) => {
            if(err) {
                return res.send( { status: 500, message: err});
            }
            res.send( { "status": 200, "user": user} );
        });

    });

    // create/update user
    app.post(baseApiUrl + 'user', (req, res) => {

        if(req.body._id) { // check if request have an id

            User.findByIdAndUpdate(req.body._id,
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                updatedAt: Date.now()
            }, err => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "message": "Successfully Updated Record"} );
            });

        } else {

            let newUser = User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            newUser.save(err => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { status: 200, message: 'New User Created Successfully'});
            });

        }

    });

    // delete user by id
    app.delete(baseApiUrl + 'user', (req, res) => {

        User.findByIdAndRemove(req.body._id, err => {
            if(err) {
                return res.send( { status: 500, message: err});
            }
            res.send( { "status": 200, "message": "User Deleted Successfully"} );
        });

    });

};