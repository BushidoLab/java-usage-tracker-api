import * as mongoose from 'mongoose';
import { GraphQLServer } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import resolvers from './resolvers';
require('dotenv').config()

const start = async () => {
  // Create a mongodb client
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', _ => console.log('MongoDB now connected'));
  const port = 4000;
  const options = {
    tracing: true,
    cacheControl: true,
    formatError,
    port
  };
  const graphQLServer = new GraphQLServer({
    typeDefs: './src/types/schema.graphql',
    resolvers,
    context: {
      db
    }
  });
  graphQLServer.start(options, _ =>
    console.log('Server is running on localhost:4000')
  );
};
start();
