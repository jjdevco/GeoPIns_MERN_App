const { AuthenticationError } = require("apollo-server-express");

const Pin = require("../models/Pin");

const authenticated = (next) => (root, args, ctx, info) => {
  const { user } = ctx;
  if (!user) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.user),
  },

  Mutation: {
    createPin: async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.user._id,
      }).save();

      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    },
  },
};
