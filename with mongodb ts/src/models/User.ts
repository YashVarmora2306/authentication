import mongoose, { Document, ObjectId } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    isVerified: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

userSchema.pre<IUser>('save', async function (next){
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function (enteredPassword:string):Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;