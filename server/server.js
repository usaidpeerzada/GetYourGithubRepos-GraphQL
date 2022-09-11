var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var cors = require("cors");
const schema = require("./schemas/schema");

// The root provides a resolver function for each API endpoint
var app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
