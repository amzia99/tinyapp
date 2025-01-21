const bcrypt = require("bcryptjs");

// URL Database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user1" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user1" },
};

// Users Database
const users = {
  aJ48lW: {
    id: "user1",
    email: "user@example.com",
    password: bcrypt.hashSync("password", 10), // prehashed user password
  },
};

module.exports = { urlDatabase, users };
