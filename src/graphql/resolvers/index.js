const { GraphQLDateTime } = require("graphql-iso-date");

const userResolver = require("./users");

const User = require("../../models/users");

module.exports = {
  Date: GraphQLDateTime,

  // Graphql type relations. (_) is the root from the parent object.
  Message: {
    sender: _ => User.findById(_.sender),
    receiver: _ => User.findById(_.receiver)
  },

  // Exporting all Queries
  Query: {
    userProfile: userResolver.userProfile
  },

  // Exporting all Mutations
  Mutation: {
    createUser: userResolver.createUser,
    createMessage: userResolver.createMessage,
    deleteMessage: userResolver.deleteMessage
  },

  // Exporting all Subscriptions
  Subscription: {
    newMessage: userResolver.newMessage,
    personTyping: userResolver.personTyping
  }
};
