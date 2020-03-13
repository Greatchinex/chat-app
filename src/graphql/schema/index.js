const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
    userProfile(userId: ID!): User!
  }

  type Mutation {
    createUser(email: String!, name: String!): Status
    createMessage(message: String!, sender: ID!, receiver: ID!): Message
    deleteMessage(messageId: String!): Status
    personTyping(senderId: ID!, receiverId: ID!): Boolean
  }

  type Subscription {
    newMessage(receiverId: ID!): Message!
    personTyping(receiverId: ID!): String
  }

  type Status {
    message: String
    user: User!
  }

  type User {
    email: String!
    name: String!
  }

  type Message {
    message: String
    sender: User
    receiver: User
    createdAt: Date
  }
`;
