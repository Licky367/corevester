require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== VIEW ENGINE =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, "public")));

// ===== SIMPLE AUTH MIDDLEWARE =====
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

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.redirect("/login");
    }
    next();
  };
};

// ===== ROUTES =====

// API routes
app.use("/api/auth", authRoutes);

// View routes
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/forgot-password", (req, res) => res.render("forgot-password"));
app.get("/reset-password/:token", (req, res) =>
  res.render("reset-password", { token: req.params.token })
);

// 🔐 PROTECTED DASHBOARDS
app.get("/client", protect, authorize("client"), (req, res) => {
  res.render("client");
});

app.get("/admin", protect, authorize("admin"), (req, res) => {
  res.render("admin");
});

// Default route
app.get("/", (req, res) => res.redirect("/login"));

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));