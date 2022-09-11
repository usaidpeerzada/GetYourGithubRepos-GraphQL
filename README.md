# Get GitHub Repos - GraphQL

### Here’s how you can create a GraphQL API to get your GitHub repositories in a React js project.

1. Create a react app using `npx create-react-app app-name`.
2. Add required dependencies. Here’s the command for both ~npm~ and ~yarn~

`npm i octokit graphql express-graphql express dotenv cors @apollo/client`

`yarn add octokit graphql express-graphql express dotenv cors @apollo/client`

3. Create a folder in which you will keep your backend related code, you can name it anything you want but the best practices include: server, backend.
4. Create a ~server.js~ file inside server folder and initialise an express app in it. Here’s the code for that:

```
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schemas/schema");

// The root provides a resolver function for each API endpoint
const app = express();

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

```

This block of code basically initialises the GraphQL server using express and also blocks CORS error . 5. Let’s create a folder inside server folder and name it schema, the folder structure would be server/schema. 6. Create a ~schema.js~ file inside the schema folder and add the following code to it:

```
require("dotenv").config();
const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const { Octokit } = require("octokit");
const octokit = new Octokit({
  auth: process.env.OCTOKIT_AUTH_KEY,
});

const RepoType = new GraphQLObjectType({
  name: "GetRepoData",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    fullName: { type: graphql.GraphQLString },
    createdAt: { type: graphql.GraphQLString },
    language: { type: graphql.GraphQLString },
    visibility: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    url: { type: graphql.GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    GetRepoById: {
      type: RepoType,
      args: { id: { type: graphql.GraphQLID } },
      async resolve(parent, args) {
        console.log(args);
        const data = await octokit.request("GET /user/repos", { per_page: 1 });

        const newData = data.data.map((l) => {
          return {
            id: l.id,
            name: l.name,
            fullName: l.full_name,
            createdAt: l.created_at,
            language: l.language,
            visibility: l.visibility,
            description: l.description,
            url: l.url,
          };
        });
        return newData.find((x) => x.id === +args.id);
      },
    },
    GetAllRepos: {
      type: graphql.GraphQLList(RepoType),
      async resolve(parent, args) {
        const data = await octokit.request("GET /user/repos", {});
        const newData = data.data.map((l) => {
          // you can add or remove the items that you want.
          return {
            id: l.id,
            name: l.name,
            fullName: l.full_name,
            createdAt: l.created_at,
            language: l.language,
            visibility: l.visibility,
            description: l.description,
            url: l.url,
          };
        });
        return newData;
      },
    },
  }),
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
```

What we are doing here is that we are connecting to the OctoKit API which is GitHub’s API that allows us to get data related to repositories in this case, but is not limited to only getting repository data.
You would need to create your authentication key in your GitHub account.
Just go to:
::Settings > Developer Settings > Personal access tokens > Generate new token::
Make sure you check the **Repo** in ~Select scopes~ section.
After you have successfully generated the token add that as the OctoKit auth value shown in the code block. 7. Run server.js file `nodemon server.js`. You will be able to interact with the API locally on http://localhost:4000/graphql
