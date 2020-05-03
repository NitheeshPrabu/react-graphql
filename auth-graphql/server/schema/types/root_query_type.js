const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID } = graphql;

const UserType = require("./user_type");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      resolve(_parentValue, _args, req) {
        // if a user is currently signed in, return that user. otherwise return undefined
        return req.user;
      },
    },
  },
});

module.exports = RootQueryType;
