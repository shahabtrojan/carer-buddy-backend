const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },

    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    interests: [],
    locations: [],
    diseases: [],
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* The `userSchema.methods.generateAuthToken` function is a method defined on the `userSchema` object.
It is used to generate an authentication token for a user. */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_KEY || "secret"
  );
  return token;
};

/* The `userSchema.pre("save", async function (next) { ... })` is a pre-save middleware function in
Mongoose. It is executed before saving a user document to the database. */
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  } else {
    next();
  }
  next();
});

const validate_signuo = (user) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validate_signuo,
};
