import User from "../models/User.js"
import generateToken from "../helpers/generateToken.js"

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send("User already exists")

        const user = await User.create({ username, email, password });

        const token = generateToken(user._id);
        res.status(201).send({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
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
    res.status(200).send({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
    });
}