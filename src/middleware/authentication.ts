import { rule, shield, and } from 'graphql-shield';
import * as jwt from 'jsonwebtoken';

//Authentication for express requests
export const expressPermissions = (req, res, next) => {
  // if (!req.header('Authorization'))
  //   return res.status(401).send({
  //     message: 'Please make sure your request has an Authorization header.'
  //   });
  // const Authorization = req.header('Authorization');
  // if (Authorization) {
  //   const token = Authorization.replace('Bearer', '');
  //   jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  // }
};

//Authentication for graphql requests
const isAuthenticated = rule()((_, {}, ctx) => {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer', '');
    jwt.verify(token, process.env.TOKEN_SECRET);
    return true;
  }
});

export const permissions = shield({
  Query: {
    fetchUsers: and(isAuthenticated),
    getManagement: and(isAuthenticated),
    getPrice: and(isAuthenticated),
    getAllLogs: and(isAuthenticated),
    getAllProcLogs: and(isAuthenticated),
    getAllNUPLogs: and(isAuthenticated),
    getReconcile: and(isAuthenticated)
  }
});
