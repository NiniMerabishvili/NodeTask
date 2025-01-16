// controllers/followController.js
const { followUser } = require('../services/followService');

const followUserController = async (req, res) => {
    const { followerId, followingId } = req.body;

    const result = await followUser(followerId, followingId);

    if (result.error) {
        return res.status(400).json({ message: result.error });  // Return error if it exists
    }

    res.status(201).json({ message: 'Followed successfully', follow: result });
}

module.exports = { followUserController };
