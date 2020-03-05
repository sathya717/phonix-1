import { Types, Schema, model, Document } from "mongoose";

interface cartModel extends Document {
  owner: String;
  items: Array<Types.ObjectId>;
}

const cartSchema = new Schema({
  owner: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      type: Types.ObjectId,
      ref: "Item"
    }
  ]
});

export default model<cartModel>("Cart", cartSchema);
