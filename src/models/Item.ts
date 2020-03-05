import { Types, Schema, model, Document } from "mongoose";

interface itemModel extends Document {
  name: String;
  price: Number;
  sold: Boolean;
  owner: Types.ObjectId;
  item_type: String;
  image: String;
}

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sold: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  item_type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model<itemModel>("Item", itemSchema);
