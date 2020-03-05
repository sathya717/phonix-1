import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret } from "../config";

const router = Router();

/* 
  Endpoint - POST /api/auth/
  Access : Public
  Desc : Authenticate a user
*/

router.post(
  "/",
  [
    check("username", "Enter a username")
      .not()
      .isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Username or Password" }] });
    }

    const str: any = user.password;

    const doesPasswordMatch = await bcrypt.compare(password, str);
    if (!doesPasswordMatch)
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Username or Password" }] });

    const payload = {
      user: {
        id: user._id
      }
    };

    user.password = undefined;

    jwt.sign(payload, secret, { expiresIn: 45000 }, (err, token) => {
      if (err)
        return res
          .status(500)
          .json({ errors: [{ msg: "Internal Server Error" }] });

      return res.json({ token, user });
    });
  }
);

export default router;
