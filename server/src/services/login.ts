import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/User";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user: any = await User.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};