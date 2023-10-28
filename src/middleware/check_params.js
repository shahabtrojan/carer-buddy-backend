function checkParameter(paramName) {
  return (req, res, next) => {
    if (req.params && req.params[paramName]) {
      next(); // Parameter exists, continue to the next middleware or route handler
    } else {
      res.status(400).json({ error: `Missing parameter: ${paramName}` });
    }
  };
}

module.exports = {
  checkParameter,
};
