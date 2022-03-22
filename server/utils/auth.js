const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  //allows token to be sent via req.body, req.query, or headers.
  authMiddleware: function ({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization
  //sep bearer from tokenvalue

  if (req.headers.authorization) {
    token = token
    .split (' ')
    .pop()
    .trim();
  }

  // if no token, return request object as is

  if(!token) {
    return req;
  }
  try {
    //decode and attach userd data to req object
    const { data } = jwt.verify(token, secret, { maxAge: expiration })
    req.user = data;
  } catch {
    console.log('Invalid token')
  }
return req;
},

  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};

/*The signToken() function expects a user object and will add that user's username, email, and _id properties to the token. Optionally, tokens can be given an expiration date and a secret to sign the token with. Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token.

*/