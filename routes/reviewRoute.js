const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const asyncError = require("../utils/asyncError");
const {validateReview, isLoggedIn, isReviewAuthor,} = require("../middlewares");
const { createReview, deleteReview } = require("../controllers/review");

//! Create Reviews route
router.post("/", isLoggedIn, validateReview, asyncError(createReview));

//! Delete Reviews route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncError(deleteReview));

module.exports = router;
