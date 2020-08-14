const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const client = new OAuth2Client(
  "21316118479-d9k2bfn95m5453md1oc73koj3p99se2q.apps.googleusercontent.com"
);

module.exports = async (req, res, next) => {
  const token = await req.headers.authorization;

  if (token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { name, email, picture } = ticket.getPayload();
      const userExist = await User.findOne({ email }).exec();

      if (userExist) {
        req.user = userExist;
      } else {
        const user = await new User({ name, email, picture }).save();
        req.user = user;
      }
    } catch (err) {
      next(err);
    }
  }
  next();
};
