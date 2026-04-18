require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const flash = require("connect-flash");

const authRoutes = require("./routes/auth");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== SESSION + FLASH =====
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// Make flash available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ===== VIEW ENGINE =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, "public")));

// ===== AUTH MIDDLEWARE =====
const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};

// Prevent logged-in users from seeing login/signup again
const redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") return res.redirect("/admin");
    return res.redirect("/client");
  } catch {
    return next();
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/login");
    }
    next();
  };
};

// ===== ROUTES =====

// API
app.use("/api/auth", authRoutes);

// AUTH VIEWS
app.get("/login", redirectIfLoggedIn, (req, res) =>
  res.render("login")
);

app.get("/signup", redirectIfLoggedIn, (req, res) =>
  res.render("signup")
);

app.get("/forgot-password", (req, res) =>
  res.render("forgot-password")
);

app.get("/reset-password/:token", (req, res) =>
  res.render("reset-password", { token: req.params.token })
);

// DASHBOARDS
app.get("/client", protect, authorize("client"), (req, res) =>
  res.render("client")
);

app.get("/admin", protect, authorize("admin"), (req, res) =>
  res.render("admin")
);

// DEFAULT
app.get("/", (req, res) => res.redirect("/login"));

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));