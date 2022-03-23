const express = require('express');
const { authMiddleware } = require('./server/utils/auth')
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

const path = require('path');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./server/schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: authMiddleware
    // by using context: ({ req }) => req.headers. This would see the incoming request and return only the headers. On the resolver side, those headers would become the context parameter.
    
    //using auth middleware provides an authenticationcheck and the updated req obj willbe passed to the resolvers as the context.

    //We'll need to perform some logic around the headers, though, like verifying the JWT. It would be cumbersome to do this in every resolver. Sounds like a good use case for a middleware function!
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
})