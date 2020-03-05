import { Router, Response, Request } from "express";
import User from "../models/User";
import Item from "../models/Item";
import { checkToken } from "../middleware/auth";
import Cart from "../models/Cart";

const router = Router();

/* 
  Endpoint - Put /api/cart/:id
  Access : Private
  Desc : Authenticate a user
*/

router.put("/:id", checkToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user);
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item)
      return res.status(400).json({ errors: [{ msg: "Irem does not exist" }] });

    if (item.owner.toString() === user._id.toString())
      return res
        .status(400)
        .json({ errors: [{ msg: "Cannot add own item to cart" }] });

    if (!user)
      return res.status(400).json({ errors: [{ msg: "User does not exist" }] });

    const cart = await Cart.findById(user.cart);

    if (!cart)
      return res.status(400).json({ errors: [{ msg: "User does not exist" }] });

    for (let item of cart.items) {
      if (item.toString() === id.toString()) {
        return res.json({ errors: [{ msg: "Item already in cart" }] });
      }
    }

    cart.items = [...cart.items, id];

    await cart.save();

    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

router.delete("/:id", checkToken, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user);
    const { id } = req.params;

    const cart = await Cart.findById(user.cart);
    const removedItemCart = cart.items.filter(item => item.toString() !== id);
    cart.items = removedItemCart;

    await cart.save();

    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
});

export default router;
