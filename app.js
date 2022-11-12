if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Fast, unopinionated, minimalist web framework for node.
const express = require("express");
// The <<path>> module provides utilities for working with file and directory paths
const path = require("path");
// <<ejs-mate>> is layout, partial and block template functions for the EJS template engine.
const ejsMate = require("ejs-mate");
// <<method-override>> Lets you use HTTP verbs such as PUT or DELETE in places
// where the client doesn't support it.
const methodOverride = require("method-override");
// <<moment>> A JavaScript date library for parsing, validating, manipulating, and formatting dates.
const moment = require("moment");
/* <<express-session>> An HTTP server-side framework
 used to create and manage a session middleware. */
const session = require("express-session");
// The flash is a special area of the session used for storing messages
const flash = require("connect-flash");
// Passport is the authentication library .
// Passport is Express-compatible authentication middleware for Node.js
const passport = require("passport");
// Passport uses the concept of strategies to authenticate requests
// passport-local is an authentication strategy.
const LocalStrategy = require("passport-local");
// <<connect-mongo>> MongoDB session store for Connect and Express written in Typescript.
const MongoDBStore = require("connect-mongo");
// <<express-mongo-sanitize>> protect ourselves against this malicious attack,
// middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection attack.
const mongoSanitize = require("express-mongo-sanitize");
// <<cors>> CORS is a node.js package for providing a
// Connect/Express middleware that can be used to enable CORS
const cors = require("cors");
const cookieParser = require("cookie-parser");
const i18nextMiddleware = require("i18next-http-middleware");
var compression = require("compression");

// ========================= Models import =============================
const User = require("./models/user/user");
const ExpressError = require("./utils/ExpressError");
// ========================= Routes import =============================
const participantRoutes = require("./routes/participants/participants");
const userRoutes = require("./routes/users/user");
const eventRoutes = require("./routes/events/event");
const videosRoutes = require("./routes/videos/video");
const articlesRoutes = require("./routes/articles/article");
const programRoutes = require("./routes/events/program");
const Article = require("./models/articles/article");
const DBConnection = require("./database/connection");
const { errorPage } = require("./middleware/middleware");
const { sessionConfig } = require("./config/sessionConfig");
// i18next contains the language configuration
const i18next = require("./config/i18next");
// the local file contain all the local variable
const { locals } = require("./config/local");

const app = express();
app.set("trust proxy", true);
// ====================================================
// =========================== Language Configuration =========================
app.disable("x-powered-by");

app.use(i18nextMiddleware.handle(i18next));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// in order to get the data from a request we need to use this express.json()
app.use(express.json());
app.use(methodOverride("_method"));
// This is a built-in middleware function in Express. It serves static files
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(mongoSanitize({ replaceWith: "_" }));
app.use(session(sessionConfig));
app.use(flash());
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  "user",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username.toLowerCase() }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      } else {
        if (user.approved) {
          return done(null, user);
        } else {
          return done(null, false, "Your account is not approved yet");
        }
      }
    });
  })
);

// serialization refers to how to store user's
// authentication user data will be stored in the session
passport.serializeUser((user, done) => {
  passport.serializeUser(User.serializeUser());
  done(null, user);
});

// deserialization refers to how remove user's authentication data
passport.deserializeUser((user, done) => {
  passport.deserializeUser(User.deserializeUser());
  done(null, user);
});
app.use(locals);
app.use(cors());

// ============== Routes ================================
app.use("/about", (req, res) => {
  res.send("Welcome to the about Page");
});
// app.get("/events", async (req, res) => {
//   //  res.send(req.ip)
//   res.render("events/index", { moment });
// });
// ===== User Routes ====
app.use("/events/:id/program", programRoutes);
app.use("/participants/:eventid", participantRoutes);
// app.use("/events/:id/participants", participant);
app.use("/user", userRoutes);
app.use("/events", eventRoutes);
app.use("/videos", videosRoutes);
app.use("/articles", articlesRoutes);
app.use("/articles/:idarticle", articlesRoutes);
app.use("/videos/:idvideo", videosRoutes);

// ==== set language ===
app.get("/:lang", (req, res) => {
  var { lang } = req.params;
  // console.log(lang);
  i18next.changeLanguage(lang).then((t) => {
    t("hello_message");
  });
  res.cookie("lang", lang);
  if (res.locals.currentUser)
    res.locals.updateUserLng(lang, res.locals.currentUser.userType);
  res.redirect("/events");
});
// === Home Page ===

app.get("/", async (req, res) => {
  const articles = await Article.find({}).sort({ date: -1 }).limit(2);
  //  res.send(articles)
  res.render("home/home", { articles, moment });
});
// ========== if none of the routes match then it's error ==========
app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});
app.use(errorPage);
// the PORT variable is in .env file but it won't be added to the deployed site
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("===================================================");
  console.log(`   ----- SERVER IS RUNNING ON PORT ${port} ----`);
  console.log("===================================================");
});
