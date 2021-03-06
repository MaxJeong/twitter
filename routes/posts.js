const router = require('express').Router();
const passport = require('passport');
const Post = require('../models/Post');

//Router to add new post
router.route('/add').post(
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const text = req.body.text.trim();

		const newPost = new Post({
			user: {
				id: req.user.id,
				username: req.user.username
			},
			text
		});

		newPost.save()
			.then(post => res.json(post))
			.catch(err => console.log(err))
});

//Router to get all posts from the database, from newest to oldest
router.route('/').get((req, res) => {
	Post.find()	
		.sort({ createdAt: -1 })
		.then(posts => res.json(posts))
		.catch(err => console.log(err))
});

//Router for fetching all posts from the current user's following users
router.route('/following').get(
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Post.find({
			'user.id': { $in: req.user.following }
		})
		.sort({ createdAt: -1 })
		.then(posts => res.json(posts))
		.catch(err => console.log(err))
})

//Router to get all posts from a specific user
router.route('/:userId').get((req, res) => {
	Post.find({ 'user.id': req.params.userId })
		.sort({ createdAt: -1 })
		.then(posts => res.json(posts))
		.catch(err => console.log(err))
});

module.exports = router
