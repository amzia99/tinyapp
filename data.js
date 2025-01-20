// data code
// bcrypt for hashing user passwords
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

// Function to filter URLs for a specific user
const urlsForUser = (id) => {
  const userURLs = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === id) {
      userURLs[urlID] = urlDatabase[urlID];
    }
  }
  return userURLs;
};

module.exports = {urlDatabase,
  users,
  urlsForUser,
};
