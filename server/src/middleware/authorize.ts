import { Request, Response, NextFunction } from "express";

const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    next();
  };

export default authorize;