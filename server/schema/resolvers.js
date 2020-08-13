const user = {
  _id: "1",
  name: "Jose",
  email: "test@mail.com",
  picture: "picture_url",
};

module.exports = {
  Query: {
    me: () => user,
  },
};
