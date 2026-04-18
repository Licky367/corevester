const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out" });
};