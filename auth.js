const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Authentication service started on port 3000');
});

//these would be hashed passwords in real life
const users = [
  {
    username: 'john',
    password: 'password123admin',
    role: 'admin'
  }, {
    username: 'ana',
    password: 'password123member',
    role: 'member'
  }
];

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//wouldn't want to be this simple in real life, this is how we're signing our JWT token
const accessTokenSecret = 'youraccesstokensecret';

app.post('/login', (req, res) => {
  //Read username and password from request body
  const { username, password } = req.body;

  //Filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if(user) {
    //Generate an access token
    const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret);

    res.json({
      accessToken
    });
  } else {
    res.send('Username or password incorrect');
  }
});
