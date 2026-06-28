const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/'});
const upload = multer({ storage });

//Validation for Schema Middleware in middleware.js

//Restructuring router with same route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single('listing[image][url]'),
  validateListing,
  wrapAsync(listingController.createListing)
);
// .post( upload.single('listing[image][url]'), (req, res) => {
//   res.send(req.file);
// });

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image][url]'),
  validateListing,
   wrapAsync(listingController.updateListing))
   .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Index Route
// router.get("/", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", {allListings});    ///listings/
// }));

//router.get("/", wrapAsync(listingController.index));


//New Route  is new route ko show route se upr rkhna h
// router.get("/new", isLoggedIn, (req, res) => {
//   res.render("listings/new.ejs");
// });
// router.get("/new", isLoggedIn, listingController.renderNewForm);


//Show Route
//Code in controller-> listing.js

// router.get("/:id", wrapAsync(listingController.showListing)
// );


//Create Route
// router.post("/", isLoggedIn, validateListing,
//    wrapAsync(async (req, res, next) => {
//   // let result = listingSchema.validate(req.body);
//   // console.log(result);
//   // if(result.error) {
//   //   throw new ExpressError(400, result.error);
//   // }
//   // if(!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing");
//   // }
//   //let {title, description, image, price, country, location} = req.body
//   const newListing = new Listing(req.body.listing);
//   // if(!newListing.title) {
//   //   throw new ExpressError(400, "Title is missing!");
//   // }
//   // if(!newListing.description) {
//   //   throw new ExpressError(400, "Description is missing!");
//   // }
//   // if(!newListing.location) {
//   //   throw new ExpressError(400, "Location is missing!");
//   // }
//   newListing.owner = req.user._id;
//   await newListing.save();
//   req.flash("success", "New Listing Created!");
//   res.redirect("/listings");
// }));

// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );


//Edit Route
router.get("/:id/edit", 
  isLoggedIn, 
  isOwner,
  wrapAsync(listingController.renderEditForm));

//Update Route
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//    wrapAsync(listingController.updateListing));

//Delete Route
//router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;