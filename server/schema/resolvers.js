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
    getPins: authenticated(async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }),
  },

  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.user._id,
      }).save();

      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinRemoved = await Pin.findOneAndDelete({
        _id: args.pinId,
        author: ctx.user._id,
      }).exec();

      return pinRemoved;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.user._id };

      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");

      return pinUpdated;
    }),
  },
};
