import { Schema, model, Types, Document } from "mongoose";

export interface userModel extends Document {
  username: String;
  password: String;
  email: String;
  items_bought: Array<Types.ObjectId>;
  items_sold: Array<Types.ObjectId>;
  items_for_sale: Array<Types.ObjectId>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items_bought: [
    {
      type: Types.ObjectId,
      ref: "Item"
    }
  ],
  items_sold: [
    {
      type: Types.ObjectId,
      ref: "Item"
    }
  ],
  items_for_sale: [
    {
      type: Types.ObjectId,
      ref: "Item"
    }
  ],
  cart: {
    type: Types.ObjectId,
    ref: "Cart"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model<userModel>("User", userSchema);
