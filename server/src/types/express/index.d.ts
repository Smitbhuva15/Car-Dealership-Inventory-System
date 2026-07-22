import { IUser } from "../../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: string;
    }
  }
}

export {};