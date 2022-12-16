const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    oRating: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        userObj: { type: Object, ref: "User", required: true },
        rating: { type: Number, default: 1 },
        heading: { type: String, default: "Product Genaral" },
        reason: { type: String, default: "Neutral" },
      },
    ],
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RateSchema);
module.exports = Rating;
