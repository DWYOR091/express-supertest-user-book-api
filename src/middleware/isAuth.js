const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.code = 401;
      throw new Error("Unauthorized");
    }

    const token = authorization.split(" ")[1]; // Ambil token-nya
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = {
      id: verify.id,
      name: verify.name,
      email: verify.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAuth };
