import { print } from 'graphql';

class BasicLogging {
  requestDidStart({ queryString, parsedQuery, variables }) {
    const query = queryString || print(parsedQuery);
    console.log('QUERY: ', query);
    console.log('VARIABLES: ', variables);
  }

  willSendResponse({ graphqlResponse }) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
}

export default BasicLogging;

// To use import it and call in in Apollo Server like so:
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   extensions: [() => new BasicLogging()]
// });
