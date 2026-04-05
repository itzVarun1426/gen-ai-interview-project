import userModel from "../models/user.model.js";
import blacklistedTokenModel from "../models/blacklist.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                email: newUser.email
            }
        });
    } catch (error) {
        console.log(error);
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
                email: user.email
            }
        });

    } catch (err) {
        console.log(err);
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
        console.log(err);
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
        const user = await userModel.findById(req.decoded.id);

        return res.status(200).json({
            message: "user found",
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error getting user",
            error: err.message
        });
    }
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};