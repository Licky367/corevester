const authService = require("../services/authService");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    await authService.signup(req.body);

    req.flash("success", "Account created successfully. Please login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    // store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ROLE-BASED REDIRECT
    if (user.role === "admin") {
      return res.redirect("/admin");
    }
    return res.redirect("/client");

  } catch (err) {
    req.flash("error", "Invalid email or password");
    res.redirect("/login");
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);

    req.flash("success", "Password reset link sent to your email");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/forgot-password");
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    req.flash("success", "Password reset successful. You can now login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("back");
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie("token");

  req.flash("success", "Logged out successfully");
  res.redirect("/login");
};