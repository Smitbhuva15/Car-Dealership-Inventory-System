import { IUser } from "../../model/User"; 

declare global {
    namespace Express {
        interface Request {
            user?: HydratedDocument<IUser>;
            role?: string;
        }
    }
}

export { };