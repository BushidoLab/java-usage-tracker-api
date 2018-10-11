import {
    MongoClient
} from 'mongodb';
import {
    GraphQLServer
} from 'graphql-yoga'
import resolvers from './resolvers'

const start = async () => {
    // Create a mongodb client
    const mongoClient = await MongoClient.connect(
        process.env.MONGODB_URI,
    );
    const db = mongoClient.db(process.env.MONGODB_NAME);

    const graphQLServer = new GraphQLServer({
        typeDefs: "./src/types/schema.graphql",
        resolvers,
        context: {
            db
        }
    });
    graphQLServer.start();
}
start()