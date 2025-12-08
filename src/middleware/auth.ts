// higher order function  return korbe function k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "No token provided!" });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      if (!token) {
        return res.status(500).json({ message: "You are not allowed!!" });
      }
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      req.user = decoded;

      // roles = ["admin"]
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(500).json({
          error: "unauthorized!!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
