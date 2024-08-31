import User from "../models/User.js"
import { generateToken, handleUpload } from "../helpers/index.js";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const profilePicture = await handleUpload(req.file.buffer)
    try {
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send("User already exists")

        const user = await User.create({ username, email, password, profilePicture });

        const token = generateToken(user._id);
        res.status(201).send({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error")
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const matchedPassword = await user?.matchPassword(password) ?? false
        if (user && matchedPassword) {
            const token = generateToken(user._id);
            res.status(200).send({
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            });
        } else {
            res.status(401).send("Invalid email or password")
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }

}

export const getProfile = (req, res) => {
    const { _id, username, email, profilePicture } = req.user;
    try {

        res.status(200).send({
            _id,
            username,
            email,
            profilePicture,
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}