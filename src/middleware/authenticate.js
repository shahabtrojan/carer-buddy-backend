const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-sh-auth");
    if (!token)
      return res.status(401).send({
        code: 401,
        message: "Please authenticate.",
      });
    const decoded = jwt.verify(token, "secret");
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      return res.status(401).send({
        code: 401,
        message: "Please authenticate.",
      });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
