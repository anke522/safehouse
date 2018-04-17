import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import * as types from './data/gql/types';
import * as allResolvers from './data/gql/resolvers';
import { SafehouseContext, createSafehouseContext } from './data/gql/context';

const typeDefs = Array.from(Object.values(types));
const resolvers = Array.from(Object.values(allResolvers));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const initContext = (context: SafehouseContext): SafehouseContext => {
  context.buildingsRepository.add('1', {
    id: '1',
    name: 'safehouse',
    color: 'none',
    position: {
      lon: -82.4374762,
      lat: 27.9561611,
      alt: 0.0
    }
  });

  return context;
};

const context = initContext(createSafehouseContext());

const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Hello Safe House!!!'));

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context }));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(3000, () => console.log('Safehouse server listening on port 3000!'));
