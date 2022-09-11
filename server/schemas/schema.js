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
