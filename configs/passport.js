const passport = require('passport')
const UserService = require('../services/user');
const passportJWT = require("passport-jwt")
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { TOKEN_KEYWORD } = require('../util/constant');

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_KEYWORD
},
  (jwtPayload, cb) => {
    const { id } = jwtPayload
    return UserService.find({ _id: id })
      .then(user => {
        return cb(null, user[0]);
      })
      .catch(err => {
        return cb(err);
      });
  }
));

