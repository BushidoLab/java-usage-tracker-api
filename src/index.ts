import * as mongoose from 'mongoose';
import { GraphQLServer } from 'graphql-yoga';
import { formatError } from 'apollo-errors';
import resolvers from './resolvers';
import { CronJob } from 'cron';
import { MailerService } from './services/mailingService';
import { management } from './db/models/Management';
import { permissions } from './middleware/authentication';
import router from './middleware/express';
import * as cors from 'cors';

require('dotenv').config();

const start = async () => {
  // Create a mongodb client
  mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  );
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', _ => console.log('MongoDB now connected'));
  let manageForms: Array<any> = await management.find();

  // Mailing service cronjob, set to run every day at 8:00 AM
  const task = new CronJob('0 8 * * *', () => {
    manageForms.forEach(form => {
      if (form.user != undefined) {
        MailerService.sendMail(form);
      }
    });
  });
  task.start();

  const port = process.env.PORT || 4000;
  const options = {
    tracing: true,
    cacheControl: true,
    formatError,
    port
  };

  const graphQLServer = new GraphQLServer({
    typeDefs: './src/types/schema.graphql',
    resolvers,
    // middlewares: [permissions],
    context: req => ({
      ...req,
      db
    })
  });

  graphQLServer.express.use(cors())
  graphQLServer.express.use('/upload', router);

  graphQLServer.start(options, _ =>
    console.log('Server is running on port:', port)
  );
};
start();
