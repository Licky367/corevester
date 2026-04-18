const authService = require("../services/authService");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    await authService.signup(req.body);

    // after signup → go to login
    res.redirect("/login");
  } catch (err) {
    res.status(400).send(err.message);
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
      secure: false, // set true in production (HTTPS)
    });

    // 🔥 ROLE-BASED REDIRECT
    if (user.role === "admin") {
      return res.redirect("/admin");
    } else {
      return res.redirect("/client");
    }

  } catch (err) {
    res.status(401).send("Invalid credentials");
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);

    res.redirect("/login");
  } catch (err) {
    res.status(404).send(err.message);
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    res.redirect("/login");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};