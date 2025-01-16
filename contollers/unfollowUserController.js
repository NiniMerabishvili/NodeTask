// controllers/unfollowUserController.js
const followService = require('../services/followService');

const unfollowUserController = async (req, res) => {
    const { followingId } = req.body;
    const followerId = req.user.id;  // Assuming user ID is available after authentication

    // Ensure that followingId is valid
    if (!followingId || isNaN(followingId)) {
        return res.status(400).json({ error: 'Invalid or missing followingId' });
    }

    try {
        const result = await followService.unfollowUser(followerId, followingId);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { unfollowUserController };
