import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import {sequelize} from "../config/db.js";


class User extends Model {
    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "User",
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

export default User;