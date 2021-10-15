const {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLString,
} = require("graphql");
const { GraphQLEmail } = require("./emailType");

const { User, Post, Comment } = require("../models");

const RoleEnumType = new GraphQLEnumType({
  name: "RoleEnumType",
  values: {
    user: {
      value: "user",
    },
    admin: {
      value: "admin",
    },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User Type",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLEmail) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(RoleEnumType) },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post Type",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.authorId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find({ postId: parent.id });
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "Comment Type",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    comment: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.postId);
      },
    },
  }),
});

module.exports = {
  RoleEnumType,
  UserType,
  PostType,
  CommentType,
};
