// controllers/bookingController.js
const Booking = require("../models/booking");
const Listing = require("../models/listing");

// show booking form
module.exports.renderBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("bookings/new", { listing });
};

// Handle booking submision
module.exports.createBooking = async (req, res) => {
  const { startDate, endDate } = req.body;

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const booking = await Booking.create({
    user: req.user._id,
    listing: listing._id,
    startDate,
    endDate,
    status: "pending"
  });

  req.flash("success", "Booking created successfully");
  // res.redirect(`/bookings/${booking._id}`);
  res.redirect(`/listings`);
  // res.send("Booking created");
};

// CANCEL booking
module.exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You are not authorized to cancel this booking");
      return res.redirect("/bookings");
    }

    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/bookings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while cancelling booking");
    res.redirect("/bookings");
  }
};
