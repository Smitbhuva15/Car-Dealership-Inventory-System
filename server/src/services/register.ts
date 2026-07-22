import { User } from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (userData: any) => {
  const { name, email, password } = userData;

  await User.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  const token = jwt.sign(
    {
      id: savedUser._id.toString(),
      email: savedUser.email,
      role: savedUser.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: savedUser,
    token,
  };
};