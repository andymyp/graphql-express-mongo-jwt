const { GraphQLScalarType, GraphQLError, Kind } = require("graphql");

const isEmail = (value) => {
  const emailRegex = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
  );

  return emailRegex.test(value);
};

const GraphQLEmail = new GraphQLScalarType({
  name: "Email",
  description:
    "The `Email` scalar type represents an email address as specified by [RFC822](https://www.w3.org/Protocols/rfc822/).",
  serialize: (value) => {
    if (!isEmail(value)) {
      throw new GraphQLError("Please enter a valid email");
    }

    return value;
  },
  parseValue: (value) => {
    if (!isEmail(value)) {
      throw new GraphQLError("Please enter a valid email");
    }

    return value;
  },
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError("Please enter a valid email");
    }

    if (!isEmail(ast.value)) {
      throw new GraphQLError("Please enter a valid email");
    }

    return ast.value;
  },
});

module.exports = {
  GraphQLEmail,
};
