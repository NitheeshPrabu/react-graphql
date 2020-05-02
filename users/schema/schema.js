const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// must be declared before the UserType!
const CompanyType = new GraphQLObjectType({
  name: "Company",
  // function is required - we are utilising the concept of javascript 'closures'.
  // the function will be defined, but will not be executed until after the entire file has been executed.
  // NOTE: graphql internally executes this function
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, _args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((response) => response.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, _args) {
        // a resolve is needed for company, because the schema in graphql uses different property name
        // compared to the actual data schema (in this case API returns 'companyId')
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(_parentValue, args) {
        // reach out to db and grab the data
        // can also return a promise
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(_parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // naming convention - a verb describing what the mutation does
    addUser: {
      // the type of data that the mutation will return, not the data which is going to be
      // worked on (in this case both are User,but this might not be the case always)
      type: UserType,
      args: {
        firstName: { type: GraphQLNonNull(GraphQLString) }, // required args
        age: { type: GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(_parentValue, { firstName, age }) {
        return axios
          .post(`http://localhost:3000/users`, { firstName, age })
          .then((response) => response.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(_parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((response) => response.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(_parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args) // json-server ignores the id property if present in the PATCH body
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });

/**
 * Query Fragments example
 *
 * query {
 *  company(id: "2") { ...companyDetails }
 * }
 *
 * fragment companyDetails on Company{
 *  name, users { id }
 * }
 *
 */
