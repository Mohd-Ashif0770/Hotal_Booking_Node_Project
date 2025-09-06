const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;

    req.flash("error", "You must be Logged in first!");
    return res.redirect("/login");
  }
  next();
};

const saveOriginalUrl = (req, res, next) => {
  if (req.session.originalUrl) {
    res.locals.redirectUrl = req.session.originalUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//! Validate listing
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate({ listing: req.body.Listing });
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//! Validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
module.exports = {
  isLoggedIn,
  saveOriginalUrl,
  isOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
};
