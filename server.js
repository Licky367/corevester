require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 needed for form submissions

// ===== VIEW ENGINE =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== STATIC FILES (optional but useful) =====
app.use(express.static(path.join(__dirname, "public")));

// ===== ROUTES =====

// API routes
app.use("/api/auth", authRoutes);

// View routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.get("/reset-password/:token", (req, res) => {
  res.render("reset-password", { token: req.params.token });
});

// Default route
app.get("/", (req, res) => {
  res.redirect("/login");
});

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));