import merge from "lodash.merge";
import conversationResolvers from "./conversation.js";
// import messageResolvers from "./messages";
import userResolvers from "./users.js";
// import scalarResolvers from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
//   scalarResolvers,
   conversationResolvers,
//   messageResolvers
);

export default resolvers;