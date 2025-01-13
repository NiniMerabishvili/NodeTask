const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Save files in the public/images folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate a unique filename
    }
});

const upload = multer({ storage });

router.get('/getAll', userService.getAll);
router.post('/register', userService.register);
router.post('/login', userService.login);
router.post('/uploadProfilePicture', upload.single('profilePicture'), userService.uploadProfilePicture);
router.post('/follow', userService.followUser);
router.post('/unfollow', userService.unfollowUser);
router.get('/:userId/followers', userService.listFollowers);
router.get('/:userId/following', userService.listFollowing);

module.exports = router;
