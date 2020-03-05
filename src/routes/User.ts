import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult, check } from "express-validator/check";
import User from "../models/User";
import { salt, secret } from "../config";
import Item from "../models/Item";
import { checkToken } from "../middleware/auth";
import Cart from "../models/Cart";

const router = Router();

/* 
  Endpoint - GET /api/users/:id
  Access : Public
  Desc : Get a user details
*/

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "items_for_sale",
        populate: {
          path: "items_sold",
          model: "Item"
        }
      });
    if (!user)
      return res.status(400).json({ errors: [{ msg: "User does not exist" }] });

    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

/* 
  Endpoint - POST /api/users
  Access : Public
  Desc : Create a new user
*/

router.post(
  "/",
  [
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
      const { username, email, password } = req.body;

      const doesUserExist: any =
        (await User.findOne({ username })) || (await User.findOne({ email }));
      if (doesUserExist) {
        console.log(doesUserExist);
        if (doesUserExist.email === email)
          return res
            .status(400)
            .json({ errors: [{ msg: "Email is already taken." }] });
        else
          return res
            .status(400)
            .json({ errors: [{ msg: "Username is already taken." }] });
      }

      const user = new User({
        username,
        email
      });
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      const payload = {
        user: {
          id: user._id
        }
      };

      const cart = new Cart();
      cart.owner = user._id;
      user.cart = cart._id;
      await user.save();
      await cart.save();

      jwt.sign(payload, secret, { expiresIn: 45000 }, (err, token: string) => {
        if (err) {
          return res
            .status(500)
            .json({ errors: [{ msg: "Internal Server error" }] });
        }
        return res.json({ token, user });
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

/* 
  Endpoint - DELETE /api/users/:id
  Access : Private
  Desc : Delete a exsisting user
*/

router.delete("/:id", checkToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    if (id.toString() !== req.user.toString()) {
      return res
        .status(403)
        .json({ errors: [{ msg: "Unauthorized Request" }] });
    }

    let user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "User with id does not exist" }] });

    const useritems = await Item.find({ owner: id });

    useritems.forEach(item => item.remove());

    const cart = await Cart.findById(user.cart);

    await cart.remove();

    await user.remove();
    return res.json({ status: "Success", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

export default router;
