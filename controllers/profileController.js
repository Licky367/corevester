const profileService = require("../services/profileService");

exports.getProfile = async (req, res) => {
  try {
    const user = await profileService.getProfile(req.user.id);
    res.render("profile", { user });
  } catch (err) {
    req.flash("error", "Unable to load profile");
    res.redirect("/");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    // handle image upload
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    await profileService.updateProfile(req.user.id, updateData);

    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/profile");
  }
};