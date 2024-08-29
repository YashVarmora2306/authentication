import jwt from "jsonwebtoken";

const generateToken = (id: string):string => {
    return jwt.sign({ id }, `${process.env.SECRET_KEY}`, {
        expiresIn: "1h"
    });
}

export default generateToken