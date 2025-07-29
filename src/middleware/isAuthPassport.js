const passport = require("passport");

// const isAuthPassport = (...roles) => {
//   return (req, res, next) => {
//     passport.authenticate("jwt", { session: false }, (err, user) => {
//       if (!user) {
//         res.code = 401;
//         throw new Error("Unauthorized");
//       }

//       if (!roles.includes(user.role)) {
//         res.code = 403;
//         throw new Error("Forbidden");
//       }
//       req.user = user;
//       next();
//     })(req, res, next);
//   };
// };

const isAuthPassport = passport.authenticate("jwt", { session: false });

module.exports = isAuthPassport;
