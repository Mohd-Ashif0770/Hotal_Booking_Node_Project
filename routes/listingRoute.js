const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncError = require("../utils/asyncError");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middlewares");
const { validateListing } = require("../middlewares");
const multer = require("multer");
const { storage } = require("../cloudStorage.js");
const upload = multer({ storage });
const {
  getAllListing,
  newListing,
  showListing,
  updateListing,
  renderNewListing,
  renderEditListing,
  deleteListing,
} = require("../controllers/listing");

//! Get all and create listings route
router
  .route("/")
  .get(asyncError(getAllListing))
  .post(
    // validateListing,
    isLoggedIn,
    upload.single("Listing[image]"),
    asyncError(newListing)
  );

//! Create new listing route
router.get("/new", isLoggedIn, renderNewListing);

//! Show, update, and delete routes
router
  .route("/:id")
  .get(asyncError(showListing))
  .put( isLoggedIn, isOwner,upload.single("Listing[image]"), validateListing,asyncError(updateListing))
  .delete(isLoggedIn, isOwner, asyncError(deleteListing));

//! edit & update routes
router.get("/:id/edit", isLoggedIn, isOwner, asyncError(renderEditListing));

module.exports = router;
