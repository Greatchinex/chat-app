const { ApolloError } = require("apollo-server-express");
const { withFilter } = require("apollo-server");

const User = require("../../models/users");
const Message = require("../../models/message");
const pubsub = require("../../config/pubsub");

// Variables for subscription
const NEW_MESSAGE = "newMessage";
const PERSON_TYPING = "personTyping";

module.exports = {
  createUser: async (_, { email, name }) => {
    try {
      const findUser = await User.findOne({ email });

      if (findUser) {
        throw new ApolloError("User with email already exists");
      }

      const newUser = new User({
        email,
        name
      });

      const saveUser = await newUser.save();

      // Response
      return {
        message: "User created successfully",
        user: saveUser
      };
    } catch (err) {
      throw err;
    }
  },

  userProfile: async (_, { userId }) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApolloError("User not found");
      }

      return user;
    } catch (err) {
      throw err;
    }
  },

  createMessage: async (_, { message, sender, receiver }) => {
    try {
      const newMessage = new Message({
        message,
        sender,
        receiver
      });

      const savedMessage = await newMessage.save();

      // New message subscription
      pubsub.publish(NEW_MESSAGE, {
        [NEW_MESSAGE]: savedMessage
      });

      return savedMessage;
    } catch (err) {
      throw err;
    }
  },

  deleteMessage: async (_, { messageId }) => {
    try {
      const findMessage = await Message.findById(messageId);

      if (!findMessage) {
        throw new ApolloError("Message not found");
      }

      await Message.findByIdAndRemove(findMessage._id);

      return {
        message: "Message deleted"
      };
    } catch (err) {
      throw err;
    }
  },

  personTyping: (_, args) => {
    try {
      // Person typing subscription
      pubsub.publish(PERSON_TYPING, {
        [PERSON_TYPING]: args
      });
    } catch (err) {
      throw err;
    }
  },

  // Subscriptions go below
  newMessage: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(NEW_MESSAGE),
      (payload, variables) => {
        return Boolean(
          toString(payload.newMessage._id) === toString(variables.receiverId)
        );
      }
    )
  },

  personTyping: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(PERSON_TYPING),
      (payload, variables) => {
        return Boolean(
          toString(payload.personTyping._id) === toString(variables.receiverId)
        );
      }
    )
  }
};
