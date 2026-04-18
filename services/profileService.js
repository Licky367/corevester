const User = require("../models/User");

exports.getProfile = async (userId) => {
  return await User.findById(userId);
};

exports.updateProfile = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
};