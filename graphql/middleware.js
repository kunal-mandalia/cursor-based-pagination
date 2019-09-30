
const fs = require('fs');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');
const context = require('../context/index');

const schemaFile = path.join(__dirname, 'schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
});

function initialise() {
  return graphqlHTTP({
    schema,
    context,
    graphiql: true,
  });
}

module.exports = initialise;
