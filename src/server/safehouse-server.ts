import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import * as types from './data/gql/types';
import * as allResolvers from './data/gql/resolvers';
import { createSafehouseContext } from './data/gql/context';
import { SafehouseStatus } from './data/models';
import { ElasticWatcher } from './db/elastic-watcher';

const typeDefs = Array.from(Object.values(types));
const resolvers = Array.from(Object.values(allResolvers));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const context = createSafehouseContext({
  id: '1',
  name: 'safehouse',
  status: SafehouseStatus.Normal,
  position: {
    lon: -82.4374762,
    lat: 27.9561611,
    alt: 0.0
  },
  sensors: []
});

const elasticWatcher = new ElasticWatcher({
  host: 'https://elasticsearch.blueteam.devwerx.org',
  httpAuth: 'elastic:taiko7Ei'
});

const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Hello Safe House!!!'));

app.use('/graphql', bodyParser.json(), graphqlExpress({schema, context}));

app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.listen(3000, () => console.log('Safehouse server listening on port 3000!'));
