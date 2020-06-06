import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
    files: [String]
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!

    signIn(login: String!, password: String!): Token!

    deleteUser(id: ID!): Boolean!

    uploadFile(file: Upload!): Boolean
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    messages: [Message!]
  }
`;
