const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("../graphql/schema");
const { authentication } = require("../middleware/auth");

const router = express.Router();

router.use(authentication);
router.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
