import { combineResolvers } from 'graphql-resolvers';

import { isAuth, isMessageOwner } from './auth';

export default {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuth,
      async (parent, { text }, { models, me }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      }
    ),

    deleteMessage: combineResolvers(
      isAuth,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      }
    ),
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};
