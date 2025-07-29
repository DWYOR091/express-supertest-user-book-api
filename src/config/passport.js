var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const prisma = require("./prisma");
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
const configurePassport = (passport) => {
  return passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await prisma.user.findFirst({ where: { id: payload.id } });
        if (user) {
          return done(null, {
            id: user.id,
            name: user.email,
            email: user.email,
            role: user.role,
          });
        }
        return done(null, false);
      } catch (error) {
        done(error, false);
      }
    })
  );
};

module.exports = configurePassport;
