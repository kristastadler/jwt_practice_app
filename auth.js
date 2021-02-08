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
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

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
    const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken
    });
  } else {
    res.send('Username or password incorrect');
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, {expiresIn: '20min'});

    res.json({
      accessToken
    });
  });
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(token => t !== token);

  res.send("Logout successful!");
});
