import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator/check";
import { checkToken } from "../middleware/auth";
import Item from "../models/Item";
import User from "../models/User";

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
    check("name", "Enter item name")
      .not()
      .isEmpty(),
    check("price", "Enter price")
      .not()
      .isEmpty(),
    check("item_type", "Enter item type")
      .not()
      .isEmpty(),
    check("image", "Enter a image")
      .not()
      .isEmpty()
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = req.user;
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User does not exist" }] });
      }
      const { name, price, item_type, image } = req.body;
      console.log(item_type === "mobile");
      if (item_type !== "mobile" && item_type !== "laptop") {
        return res.status(400).json({
          errors: [{ msg: "Invalid item type : either laptop or mobile" }]
        });
      }

      const item = new Item({
        name,
        price,
        item_type,
        image
      });

      item.owner = user;

      user = await User.findById(user);
      user.items_for_sale = [...user.items_for_sale, item.id];
      await user.save();
      await item.save();

      return res.json({ item });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  }
);

export default router;
