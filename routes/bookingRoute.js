// routes/bookings.js
const express = require("express");
const router = express.Router();
const { renderBookingForm, createBooking, cancelBooking,showBookings, viewBooking } = require("../controllers/booking");
const { isLoggedIn } = require("../middlewares");

router.get("/listings/:id/book", isLoggedIn, renderBookingForm);
router.post("/listings/:id/book", isLoggedIn, createBooking);
// router.post("/listings/:id/cancel", isLoggedIn, cancelBooking);

router.get("/my-bookings", isLoggedIn, showBookings)
router.get("/my-bookings/:id", isLoggedIn, viewBooking)

module.exports = router;
