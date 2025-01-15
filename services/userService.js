    const bcrypt = require('bcrypt');
    const User = require('../models/User');
    console.log(User);
    const Follow = require('../models/follow')
    console.log(User);
    const jwt = require('jsonwebtoken');
    const fs = require('fs');
    
    module.exports = {
        getAll: (req, res) => {
            User.findAll()
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        },
    
        register: async (req, res) => {
            const { username, password, profilePicture } = req.body;
    
            if (!username || !password) {  // Only check for username and password
                throw new Error('Username and password are required');
            }
    
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new Error('Username already exists');
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await User.create({
                username,
                password: hashedPassword,
                profilePicture,  // Keep profilePicture if needed
            });
    
            const token = jwt.sign(
                { id: newUser.id, username: newUser.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            return res.json({ message: 'Registration successful', token });
        },
        
        // login: async (req, res) => {
        //     const { username, password } = req.body;
        //
        //     try {
        //         const user = await User.findOne({ where: { username } });
        //
        //         if (!user) {
        //             return res.status(401).json({ message: 'Authentication failed. User not found.' });
        //         }
        //
        //         const isPasswordValid = await bcrypt.compare(password, user.password);
        //         if (!isPasswordValid) {
        //             return res.status(401).json({ message: 'Invalid credentials' });
        //         }
        //
        //         if (!username || typeof username !== 'string') {
        //             throw new Error('Invalid username');
        //         }
        //         console.log('Username:', username);
        //
        //         const token = jwt.sign(
        //             {
        //                 id: user.id,
        //                 username: user.username,
        //             },
        //             process.env.JWT_SECRET,
        //             { expiresIn: '1h' }
        //         );
        //
        //         return res.json({
        //             message: 'Login successful',
        //             token,
        //             user: {
        //                 id: user.id,
        //                 username: user.username,
        //                 profile_picture: user.profile_picture,
        //             },
        //         });
        //     } catch (error) {
        //         console.error('Login error:', error);
        //         return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        //     }
        // },

        login: async (req, res) => {
            const { username, password } = req.body;

            try {
                const user = await User.findOne({ where: { username } });

                if (!user) {
                    return res.status(401).json({ message: 'Authentication failed. User not found.' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return res.json({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        profile_picture: user.profile_picture,
                    },
                });
            } catch (error) {
                console.error('Login error:', error);
                return res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        },

        // uploadProfilePicture: async (req, res) => {
        //     const { username } = req.body;
        //     if (!username) {
        //         throw new Error('Username is required');
        //     }
        //     const userId = req.user.id;
        //     const profilePicturePath = `images/${req.file.filename}`;
        //
        //     try {
        //         const user = await User.findByPk(userId);
        //         if (!user) {
        //             return res.status(404).json({ message: 'User not found' });
        //         }
        //
        //         if (user.profile_picture) {
        //             const oldPath = `public/${user.profile_picture}`;
        //             if (fs.existsSync(oldPath)) {
        //                 fs.unlinkSync(oldPath);
        //             }
        //         }
        //
        //         user.profile_picture = profilePicturePath;
        //         await user.save();
        //
        //         return res.json({
        //             message: 'Profile picture updated successfully',
        //             profile_picture: profilePicturePath,
        //         });
        //     } catch (error) {
        //         console.error('Error uploading profile picture:', error);
        //         return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        //     }
        // },

        uploadProfilePicture: async (req, res) => {
            // Remove this check if you're using JWT authentication and req.user is set
            // const { username } = req.body;
            // if (!username) {
            //     throw new Error('Username is required');
            // }

            const userId = req.user.id;  // Assuming you're using JWT and the user is authenticated
            const profilePicturePath = `images/${req.file.filename}`;

            try {
                const user = await User.findByPk(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if (user.profile_picture) {
                    const oldPath = `public/${user.profile_picture}`;
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }

                user.profile_picture = profilePicturePath;
                await user.save();

                return res.json({
                    message: 'Profile picture updated successfully',
                    profile_picture: profilePicturePath,
                });
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                return res.status(500).json({ message: 'Internal Server Error', error: error.message });
            }
        }
    }