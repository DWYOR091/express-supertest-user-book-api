const isRole = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      console.log(user);
      if (!roles.includes(user.role)) {
        res.code = 403;
        throw new Error("Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = isRole;
