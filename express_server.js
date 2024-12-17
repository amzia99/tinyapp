// express server
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = {};


const getUserByEmail = (email, usersDb) => {
  for (const userId in usersDb) {
    if (usersDb[userId].email === email) {
      return usersDb[userId];
    }
  }
  return null;
};


app.post('/register', (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).send('Error: Email or password cannot be empty.');
  }

  
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Error: Email already registered.');
  }

  
  const userId = `user_${Date.now()}`; 
  users[userId] = { id: userId, email, password };

  console.log('Updated Users Object:', users); 
  res.status(201).send('User registered successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

