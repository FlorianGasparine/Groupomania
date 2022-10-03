const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[0];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "403: unauthorized request";
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error });
  }
};
