// models/booking.js
const mongoose = require("mongoose");
const Listing = require("./listing");
const User = require("./user");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  startDate: {
    type: Date,
    required: true, 
  },
  endDate: {
    type: Date,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
    status: {
    type: String,
    default: "pending"
  }
},  { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
