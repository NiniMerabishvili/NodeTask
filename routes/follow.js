// routes/followRoutes.js
const express = require('express');
const router = express.Router();
const { followUserController } = require('../contollers/followUserController');
const { unfollowUserController } = require('../contollers/unfollowUserController');
const followService = require('../services/followService')
const userService = require("../services/userService");
const authenticateUser = require('../middleware/authenticateUser')

// Route to follow a user
router.post('/follow', authenticateUser, followUserController);
router.post('/unfollow', authenticateUser, unfollowUserController);
router.get('/getAllFollowers', authenticateUser, followService.getAllFollowers);
router.get('/getAllFollowings', authenticateUser, followService.getAllFollowings);

module.exports = router;
