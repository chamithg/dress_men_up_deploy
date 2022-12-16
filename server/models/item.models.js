const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "clothing item name is required"],
      minLength: [3, "Name should be at least 3 character long"],
    },
    type: {
      type: String,
      required: [true, "clothing item type required"],
      minLength: [3, "type should be at least 3 character long"],
    },
    desc: {
      type: String,
      required: [true, "clothing item description is required"],
      minLength: [3, "descriptions should be at least 3 character long"],
    },
    img1: {
      type: String,
      required: [true, "clothing item image 1 is required"],
    },
    img2: {
      type: String,
      required: [true, "clothing item image 2 is required"],
    },
    price: {
      type: Number,
      required: [true, "clothing item price is required"],
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      enum: ["small", "medium", "large", "xlarge"],
      default: "small",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      enum: [0, 10, 20, 30],
      default: 0,
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
