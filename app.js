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
const eventVideoRoutes = require("./routes/events/eventVideo");
const videosRoutes = require("./routes/videos/video");
const articlesRoutes = require("./routes/articles/article");
const programRoutes = require("./routes/events/program");
const Article = require("./models/articles/article");
const Video = require("./models/videos/video");
const eventUserAction = require("./routes/events/eventUserAction");
const Event = require("./models/event");
const DBConnection = require("./database/connection");
const { errorPage } = require("./middleware/middleware");
const { sessionConfig } = require("./config/sessionConfig");
// i18next contains the language configuration
const i18next = require("./config/i18next");
// the local file contain all the local variable
const { locals } = require("./config/local");

const app = express();
const axios = require("axios");
app.set("trust proxy", true);
// ====================================================
// =========================== Language Configuration =========================
app.disable("x-powered-by");

app.use(i18nextMiddleware.handle(i18next));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// in order to get the data from a request we need to use this express.json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email.toLowerCase() }).then((user,err ) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
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
// ===== User Routes ====
app.use("/events/:id/video", eventVideoRoutes);
app.use("/user", userRoutes);
app.use("/events/:id/participants", participantRoutes);
app.use("/events/:id/program", programRoutes);
app.use("/events/:id/:userid/", eventUserAction);
// app.use("/participants/:eventid", participantRoutes);
app.get("/test", async (req, res) => {
  console.log("patient");
  axios
    .get("http://127.0.0.1:8000/patient/634583c161cea2357be9e122")
    .then(function (response) {
      // handle success
      console.log(response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
});
app.use("/events", eventRoutes);
app.use("/videos", videosRoutes);
app.use("/articles", articlesRoutes);
app.use("/articles/:idarticle", articlesRoutes);
app.use("/videos/:idvideo", videosRoutes);

// ==== set language ===
app.get("/:lang", (req, res) => {
  var { lang } = req.params;

  i18next.changeLanguage(lang).then((t) => {
    t("hello_message");
  });
  res.cookie("lang", lang);

  res.redirect("/events");
});

// === Home Page ===
app.get("/", async (req, res) => {
  const articles = await Article.find({}).sort({ date: -1 }).limit(2);
  const latestEvents = await Event.find({
    "period.start": { $lt: moment() },
  })
    .sort({ "period.start": -1 })
    .limit(1);
  const upcomingEvents = await Event.find({
    "period.start": { $gt: moment() },
  })
    .sort({ "period.start": 1 })
    .limit(1);
  const videos = await Video.find({});

  //  res.send(videos)
  res.render("home/home", {
    articles,
    latestEvents,
    upcomingEvents,
    moment,
    videos,
  });
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
