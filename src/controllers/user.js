const { User, validate_signuo } = require("../models/user");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
  try {
    const { error } = validate_signuo(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { first_name, last_name, email, password } = req.body;

    // check if user already exists

    let existing_user = await User.findOne({ email });

    if (existing_user) {
      return res.status(400).json({
        code: 400,
        message: "User already exists",
      });
    }

    // create new user

    var user = new User({
      first_name,
      last_name,
      email,
      password,
    });

    user = await user.save();

    const token = await user.generateAuthToken();

    return res.status(200).json({
      code: 200,
      message: "Signup successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

const login_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    var user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });

    const token = user.generateAuthToken();

    res.status(200).json({
      code: 200,
      message: "Login Successfull",
      token: token,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const get_profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    return res.status(200).json({
      code: 200,
      message: "success",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_interest = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.interests = req.body.interests;

    return res.status(200).json({
      code: 200,
      message: "Interest added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_location = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.locations = req.body.locations;

    return res.status(200).json({
      code: 200,
      message: "Location added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_disease = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.diseases = req.body.diseases;

    return res.status(200).json({
      code: 200,
      message: "Disease added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const edit_profile = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.image = req.body.image;
    user.gender = req.body.gender;
    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// feed api in which every tiome user login it will show the feed of the user

const feed = async (req, res) => {
  try {
    // get random users  every time user login

    var users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.status(200).json({
      code: 200,
      message: "success",
      users: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  signup,
  login_user,
  get_profile,
  add_interest,
  add_location,
  add_disease,
  edit_profile,
  feed,
};
