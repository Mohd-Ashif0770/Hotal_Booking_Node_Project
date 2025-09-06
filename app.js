const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRoute = require("./routes/listingRoute");
const reviewRoute = require("./routes/reviewRoute");
const userRoute = require("./routes/userRoute");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
dotenv.config();
const port = process.env.PORT;
const db_url = process.env.ATLASDB_URL;

//! Creating connection with db
main()
  .then(() => {
    console.log("Connection created!");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(db_url);
}

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.MY_SECRET,
  },
  touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", function (e) {
  console.log("Session store error", e);
});

//! Session configuration
const sessionOptions = {
  store: store,
  secret: process.env.MY_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//! Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // we are using static method of User model to authenticate user
passport.serializeUser(User.serializeUser()); // store user in session
passport.deserializeUser(User.deserializeUser()); // unstore user from session

//! Flash message middleware
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.geoapifyKey = process.env.GEOAPIFY_KEY; //add the key to res.locals so EJS can use it.
  next();
});

app.get("/", (req, res) => {
  res.send(`Welcome to home page `);
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "fake2@gmail.com",
    username: "fakeUser2",
  });
  const newUser = await User.register(user, "password12345"); //register is a static method added by passport-local-mongoose to register new user
  res.send(newUser);
});

//! Using routes
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

//! Asynchronous error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("listings/error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
