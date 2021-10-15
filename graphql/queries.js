const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const { UserType, RoleEnumType, PostType, CommentType } = require("./types");

const { isAdmin } = require("../middleware/auth");
const { User, Post, Comment } = require("../models");

const users = {
  type: new GraphQLList(UserType),
  description:
    "List of users order by time created (Require login and admin role)",
  resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");
    if (!isAdmin(user._id)) throw new Error("Require admin role");

    return User.find().sort("createdAt").exec();
  },
};

const user = {
  type: UserType,
  description: "Get details user (Require login)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");

    return User.findById(args.id).exec();
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "List of posts order by time created",
  resolve(parent, args) {
    return Post.find().sort("createdAt").exec();
  },
};

const post = {
  type: PostType,
  description: "Get details post",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    return Post.findById(args.id).exec();
  },
};

const comments = {
  type: new GraphQLList(CommentType),
  description: "List of comments order by time created",
  resolve(parent, args) {
    return Comment.find().sort("createdAt").exec();
  },
};

const comment = {
  type: CommentType,
  description: "Get details comment",
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, args) {
    return Comment.findById(args.id).exec();
  },
};

module.exports = {
  users,
  user,
  posts,
  post,
  comments,
  comment,
};
