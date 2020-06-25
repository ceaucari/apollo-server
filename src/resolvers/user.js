import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin, isAuth } from './isAuth';

const { createWriteStream, existsSync, mkdirSync } = require('fs');
const path = require('path');

export const files = [];

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  const token = await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
  return token;
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      const allUsers = await models.User.findAll();
      return allUsers;
    },
    user: async (parent, { id }, { models }) => {
      const someUser = await models.User.findByPk(id);
      return someUser;
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      const myUser = await models.User.findByPk(me.id);
      return myUser;
    },
    files: () => files,
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password, date },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
        createdAt: date,
      });

      return { token: createToken(user, secret, '90d') };
    },

    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '90d') };
    },

    updateUser: combineResolvers(
      isAuth,
      async (_, { username, firstName, lastName, role }, { models, me }) => {
        const user = await models.User.findByPk(me.id);
        return user.update({ username, firstName, lastName, role });
      }
    ),

    deleteUser: combineResolvers(isAdmin, (_, { id }, { models }) => {
      return models.User.destroy({
        where: { id },
      });
    }),

    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;

      await new Promise((res) =>
        createReadStream()
          .pipe(createWriteStream(path.join(__dirname, '../images', filename)))
          .on('close', res)
      );

      files.push(filename);

      return true;
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      const msgs = await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
      return msgs;
    },
  },
};
