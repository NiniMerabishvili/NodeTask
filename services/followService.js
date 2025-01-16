    const User = require('../models/User'); // Adjust the path if needed
    const Follow = require('../models/Follow'); // Adjust the path if needed
    
    module.exports = {
        // Define the followUser function
        followUser: async (followerId, followingId) => {
            try {
                console.log('User model:', User); // Check if User is imported correctly
                console.log('Follower ID:', followerId, 'Following ID:', followingId);
    
                const follower = await User.findByPk(Number(followerId));
                const following = await User.findByPk(Number(followingId));
    
                console.log('Follower:', follower);
                console.log('Following:', following);
    
                if (!follower || !following) {
                    return { error: 'User(s) not found' };
                }
    
                return await Follow.create({ followerId, followingId });
            } catch (error) {
                console.error('Error:', error.message);
                return { error: error.message || 'An error occurred' };
            }
        },

        unfollowUser: async (followerId, followingId) => {
            try {
                // Log both IDs to ensure they are numbers
                console.log('Unfollow user - Follower ID:', followerId, 'Following ID:', followingId);

                // Ensure IDs are numbers
                if (isNaN(followerId) || isNaN(followingId)) {
                    return { error: 'Invalid user ID(s)' };
                }

                const unfollow = await Follow.findOne({
                    where: {
                        followerId: Number(followerId),
                        followingId: Number(followingId)
                    }
                });

                if (!unfollow) {
                    return { error: 'Follow relationship does not exist' };
                }

                // Delete the follow relationship
                await unfollow.destroy();
                console.log(`User ${followerId} unfollowed ${followingId}`);

                return { message: 'Unfollow successful' };
            } catch (error) {
                console.error('Error:', error.message);
                return { error: error.message || 'An error occurred' };
            }
        },


        getAllFollowers: (req, res) => {
            const userId = req.user.id; 
            
            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            Follow.findAll({
                where: {
                    followingId: userId 
                }
            })
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        },

        getAllFollowings: (req, res) => {
            const userId = req.user.id;

            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            Follow.findAll({
                where: {
                    followerId: userId
                }
            })
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        }
    };
