const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { users, user, posts, post, comments, comment } = require("./queries");
const {
  register,
  login,
  deleteUser,
  createPost,
  updatePost,
  deletePost,
  createComment,
} = require("./mutations");

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users, user, posts, post, comments, comment },
});

const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {
    register,
    login,
    deleteUser,
    createPost,
    updatePost,
    deletePost,
    createComment,
  },
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
