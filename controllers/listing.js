const Listing = require("../models/listing");

const getAllListing = async (req, res) => {
  const allListing = await Listing.find();
  res.render("./listings/index.ejs", { allListing });
};

const renderNewListing = (req, res) => {
  res.render("listings/new.ejs");
};
const newListing = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const listing = req.body.Listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id; // set the owner of the listing to the currently logged-in user
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

const showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

const renderEditListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_100,h_100");
  res.render("listings/edit.ejs", { originalUrl, listing });
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = req.body.Listing;

  const updatedListing = await Listing.findByIdAndUpdate(id, listing);
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings`);
};

const deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id); // This will trigger the post middleware in listingSchema
  // which will delete the associated reviews
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};

module.exports = {
  getAllListing,
  renderNewListing,
  newListing,
  showListing,
  renderEditListing,
  updateListing,
  deleteListing,
};
