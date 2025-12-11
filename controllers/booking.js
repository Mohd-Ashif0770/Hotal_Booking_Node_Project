// controllers/bookingController.js
const Booking = require("../models/booking");
const Listing = require("../models/listing");

//! show booking form
module.exports.renderBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("bookings/new", { listing });
};

//! Handle booking submision
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
    status: "pending",
  });

  req.flash("success", "Booking created successfully");
  res.redirect(`/my-bookings`);
};

//! Fetch all Bookings based on user
module.exports.showBookings = async (req, res) => {
  const userId = req.user._id;

  const bookings = await Booking.find({ user: userId })
    .populate("listing")
    .sort({ createdAt: -1 }); // latest first

  res.render("bookings/index", { bookings });
};

//! View Booking
module.exports.viewBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("listing")
    .populate("user");
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/my-bookings");
  }
  res.render("bookings/show", { booking });
};


//! Edit Booking
module.exports.renderEditBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  res.render("bookings/editBooking", { booking });
  console.log("working");
};

module.exports.editBooking = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (startDate >= endDate) {
    req.flash("error", "Booking Date should be valid");
    return res.redirect(`/my-bookings/${req.params.id}/edit`);
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, {
    startDate,
    endDate,
  });

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/my-bookings");
  }

  req.flash("success", "Booking updated successfully");
  return res.redirect(`/my-bookings/${req.params.id}`);
};

//! Cancel Booking
module.exports.cancelBooking=async(req,res)=>{
  try{
    const booking= await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking canceled successfully");
    res.redirect(`/my-bookings`);

  }catch(err){
    res.flash("error", "Error when canceling booking")
    return res.redirect(`/my-bookings/${req.params.id}`);
  }
}

// CANCEL booking
// module.exports.cancelBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Booking.findById(id);

//     if (!booking) {
//       req.flash("error", "Booking not found");
//       return res.redirect("/my-bookings");
//     }

//     // if (!booking.user.equals(req.user._id)) {
//     //   req.flash("error", "You are not authorized to cancel this booking");
//     //   return res.redirect("/bookings");
//     // }

//     await Booking.findByIdAndDelete(id);
//     req.flash("success", "Booking cancelled successfully");
//     res.redirect("/my-bookings");
//   } catch (err) {
//     console.error(err);
//     req.flash("error", "Something went wrong while cancelling booking");
//     res.redirect("/my-bookings");
//   }
// };