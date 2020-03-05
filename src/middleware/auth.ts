import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../config";

export function checkToken(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json({ errors: [{ msg: "No token provided" }] });
    }
    const decoded: any = jwt.verify(token, secret);
    if (decoded) req.user = decoded.user.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ errors: [{ msg: "Invalid token" }] });
  }
}
