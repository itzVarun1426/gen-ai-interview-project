import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { uploadToS3OrLocal } from "../services/s3.service.js";

const client = new OAuth2Client();

const cookieOptions = {
    httpOnly: true,
    secure: false,       //only while in development

};

/**
 * Register a new user
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "all fields are required"
            });
        }
        const userExists = await userModel.findOne({
            $or: [{ username }, { email }]
        });
        if (userExists) {
            return res.status(400).json({
                message: "user already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie("token", token, cookieOptions);
        return res.status(201).json({
            message: "user created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName,
                avatar: newUser.avatar,
                bio: newUser.bio,
                targetRole: newUser.targetRole,
                experienceLevel: newUser.experienceLevel
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "error creating user",
            error: error.message
        });
    }
};

/**
 * Login existing user
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "all fields are required"
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user does not exist"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "incorrect password"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                bio: user.bio,
                targetRole: user.targetRole,
                experienceLevel: user.experienceLevel
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "login failed",
            error: err.message
        });
    }
};

/**
 * Logout user
 */
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "unauthorized"
            });
        }
        res.clearCookie("token", cookieOptions);
        await blacklistedTokenModel.create({ token });

        return res.status(200).json({
            message: "user logged out successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: "error logging out user",
            error: err.message
        });
    }
};

/**
 * Get current logged-in user
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "user found",
            user
        });

    } catch (err) {
        return res.status(500).json({
            message: "error getting user",
            error: err.message
        });
    }
};

/**
 * Update user profile information
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.decoded.id;
        const { fullName, username, bio, targetRole, experienceLevel, avatar } = req.body;

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username && username !== existingUser.username) {
            const usernameTaken = await userModel.findOne({ username, _id: { $ne: userId } });
            if (usernameTaken) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(fullName !== undefined && { fullName }),
                    ...(username !== undefined && { username }),
                    ...(bio !== undefined && { bio }),
                    ...(targetRole !== undefined && { targetRole }),
                    ...(experienceLevel !== undefined && { experienceLevel }),
                    ...(avatar !== undefined && { avatar })
                }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to update profile",
            error: err.message
        });
    }
};

/**
 * Upload profile avatar image (AWS S3 or Local storage)
 */
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please select an image file to upload" });
        }

        const avatarUrl = await uploadToS3OrLocal(req.file);

        const updatedUser = await userModel.findByIdAndUpdate(
            req.decoded.id,
            { avatar: avatarUrl },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "Avatar uploaded successfully",
            avatarUrl,
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to upload avatar",
            error: err.message
        });
    }
};

/**
 * Google Auth
 */
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await userModel.findOne({ email });

        if (!user) {
            let username = name;
            let usernameExists = await userModel.findOne({ username });

            while (usernameExists) {
                username = `${name}_${Math.random().toString(36).slice(-4)}`;
                usernameExists = await userModel.findOne({ username });
            }

            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 13);
            user = await userModel.create({
                username,
                email,
                fullName: name || "",
                avatar: picture || "",
                password: hashedPassword
            });
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", jwtToken, cookieOptions);

        return res.status(200).json({
            message: "google login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                bio: user.bio,
                targetRole: user.targetRole,
                experienceLevel: user.experienceLevel
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "google auth failed",
            error: err.message
        });
    }
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    uploadAvatar,
    googleAuth
};