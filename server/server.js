const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose here
// const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
  
// Define  MongoDB URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Apply the authMiddleware to authenticate requests
    const user = authMiddleware({ req }).user;
    return { user };
  },
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

startApolloServer();

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}`);
    console.log(`🚀 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
  });
});