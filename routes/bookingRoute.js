// routes/bookings.js
const express = require("express");
const router = express.Router();
const { renderBookingForm, createBooking, cancelBooking } = require("../controllers/booking");
const { isLoggedIn } = require("../middlewares");

router.get("/listings/:id/book", isLoggedIn, renderBookingForm);
router.post("/listings/:id/book", isLoggedIn, createBooking);
// cancel a booking
router.post("/listings/:id/cancel", isLoggedIn, cancelBooking);

module.exports = router;
