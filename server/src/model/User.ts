import mongoose, { Schema } from 'mongoose';

// Define the interface for our User 
export interface IUser{
  name: string;
  email: string;
  password: string;
  role: string;
}

// Define the Mongoose schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);