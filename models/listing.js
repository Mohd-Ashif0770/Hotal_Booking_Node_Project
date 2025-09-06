const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const Review = require("./review");

const defaultImgLink =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2JeLflKzHbiITr2iiqql3VwQYGB70Py5SkQ&s";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //model name
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", //Owner should be our registerd user
  },
});

//! Mongoose middleware to delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
