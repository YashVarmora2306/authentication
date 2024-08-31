import bcrypt from "bcrypt";
import { sequelize } from "../config/db";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements IUser {
    declare id: CreationOptional<number>;
    declare username: string;
    declare email: string;
    declare password: string;
    declare profilePicture: string;

    async matchPassword(enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }

}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
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
        beforeCreate: async (user: User) => {
            user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user: User) => {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
})

export default User;