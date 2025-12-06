// routes/bookings.js
const express = require("express");
const router = express.Router();
const { renderBookingForm, createBooking,showBookings, viewBooking , editBooking,cancelBooking, renderEditBooking} = require("../controllers/booking");
const { isLoggedIn } = require("../middlewares");

router.get("/listings/:id/book", isLoggedIn, renderBookingForm);
router.post("/listings/:id/book", isLoggedIn, createBooking);

router.get("/my-bookings", isLoggedIn, showBookings)
router.get("/my-bookings/:id", isLoggedIn, viewBooking)

router.get("/my-bookings/:id/edit", isLoggedIn, renderEditBooking)
router.put("/my-bookings/:id", isLoggedIn, editBooking)
router.delete("/my-bookings/:id", isLoggedIn, cancelBooking)

module.exports = router;
