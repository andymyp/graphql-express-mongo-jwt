const bcrypt = require("bcrypt");
const _ = require("lodash");
const { GraphQLNonNull, GraphQLString } = require("graphql");
const { GraphQLEmail } = require("./emailType");
const { UserType, RoleEnumType, PostType, CommentType } = require("./types");

const { isAdmin } = require("../middleware/auth");
const { User, Post, Comment } = require("../models");

const register = {
  type: GraphQLString,
  description: "Create new user",
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLEmail) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: new GraphQLNonNull(RoleEnumType) },
  },
  async resolve(parent, args) {
    let user = await User.findOne({ email: args.email }).exec();
    if (user) {
      throw new Error("Email ini sudah terdaftar");
    }

    user = new User(_.pick(args, ["name", "email", "password", "role"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(args.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    return token;
  },
};

const login = {
  type: GraphQLString,
  description: "Login user",
  args: {
    email: { type: new GraphQLNonNull(GraphQLEmail) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    let user = await User.findOne({ email: args.email }).exec();
    if (!user) {
      throw new Error("Email tidak terdaftar");
    }

    const validPassword = await bcrypt.compare(args.password, user.password);
    if (!validPassword) {
      throw new Error("Password salah");
    }

    const token = user.generateAuthToken();
    return token;
  },
};

const deleteUser = {
  type: GraphQLString,
  description: "Delete user (Require login and admin role)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");
    if (!isAdmin(user._id)) throw new Error("Require admin role");

    let delUser = await User.findOneAndDelete({
      _id: args.id,
    });

    if (!delUser) {
      throw new Error("No user with the given ID found for the author");
    }

    return "User deleted";
  },
};

const createPost = {
  type: PostType,
  description: "Create new post (Require login)",
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");

    let post = new Post({
      authorId: user._id,
      title: args.title,
      body: args.body,
    });

    post = await post.save();
    return post;
  },
};

const updatePost = {
  type: PostType,
  description: "Update post (Require login)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");

    let post = await Post.findOneAndUpdate(
      {
        _id: args.id,
        authorId: user._id,
      },
      { title: args.title, body: args.body },
      { new: true, runValidators: true }
    );

    if (!post) {
      throw new Error("No post with the given ID found for the author");
    }

    return post;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "Delete post (Require login)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");

    let post = await Post.findOneAndDelete({
      _id: args.id,
      authorId: user._id,
    });

    if (!post) {
      throw new Error("No post with the given ID found for the author");
    }

    return "Post deleted";
  },
};

const createComment = {
  type: CommentType,
  description: "Create new comment on post (Require login)",
  args: {
    postId: { type: new GraphQLNonNull(GraphQLString) },
    comment: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { user }) {
    if (!user) throw new Error("Require login");

    let comment = new Comment({
      userId: user._id,
      postId: args.postId,
      comment: args.comment,
    });

    comment = await comment.save();
    return comment;
  },
};

module.exports = {
  register,
  login,
  deleteUser,
  createPost,
  updatePost,
  deletePost,
  createComment,
};
