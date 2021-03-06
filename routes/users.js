const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

//Router for handling registration
router.route('/register').post((req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Send error message if there are at least 1 of it
    if (!isValid) {
        return res.status(404).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'An account with that Email already exists.';
                return res.status(404).json(errors);
            }

            //Generate a hashed password then create a new user to be saved
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    const newUser = new User({
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    })

                    newUser.save()
                        .then(newUser => res.json(newUser))
                        .catch(err => console.log(err))
                })
            })
        })
});

//Router for handling login
router.route('/login').post((req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Send error message if there are at least 1 of it
    if (!isValid) {
        return res.status(404).json(errors);
    }

    /*
    Check if user with email exists first, then check if 
    their password is correct
    */
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //Create a token to be sent to the user
                        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' }, function(err, token) {
                            return res.json({
                                success: true,
                                token: token
                            })
                        });
                    } else {
                        errors.password = 'Password is incorrect.';
                        return res.status(404).json(errors);
                    }
                })
            } else {
                errors.email = 'A user with that email address is not found.';
                return res.status(404).json(errors);
            }
        })
})

//Router for returning user data after authentication
router.route('/').get(
    passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        _id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        followers: req.user.followers,
        following: req.user.following
    })
})

//Router for handling the follow feature
router.route('/follow').post(
    passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findOneAndUpdate({
            _id: req.user.id 
        }, {
            $push: { following: req.body.userId }
        },
        { new: true })
        .then(user => {
            User.findOneAndUpdate({
                _id: req.body.userId
            }, {
                $push: { followers: req.user.id }
            }, { new: true })
            .then(user => res.json({ userId: req.body.userId }))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

//Router for handling the unfollow feature
router.route('/unfollow').post(
    passport.authenticate('jwt', { session: false }), (req, res) => {
        User.findOneAndUpdate({
            _id: req.user.id
        }, {
            $pull: { following: req.body.userId }
        }, { new: true })
        .then(user => {
            User.findOneAndUpdate({
                _id: req.body.userId
            }, { 
                $pull: { followers: req.user.id }
            }, { new: true })
            .then(user => res.json({ userId: req.body.userId }))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
)

//Router for handling user search
router.route('/search').post((req, res) => {
    User.findOne({
        $or: [
            {email: req.body.text},
            {username: req.body.text}
        ]
    })
    .then(user => res.json({ userId: user._id }))
    .catch(err => res.status(404).json({ msg: 'The user is not found.'}))
})

//Router for fetching user data for the profile page
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (user) {
                return res.json({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    followers: user.followers,
                    following: user.following
                })
            } else {
                return res.status(404).json({ msg: 'The user is not found.' });
            }
        })
        .catch(err => console.log(err))
})

module.exports = router
