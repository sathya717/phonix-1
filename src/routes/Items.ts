import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { checkToken } from "../middleware/auth";

const router = Router();

/* 
  Endpoint - POST /api/items/
  Access : Private
  Desc : Add a new Item
*/

router.post(
  "/",
  [
    checkToken,
    check("username", "Enter a username")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
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
    try {
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);
