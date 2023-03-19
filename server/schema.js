import { createSchema } from 'graphql-yoga'

const messages = [];

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Message {
      id: ID!
      user: String!
      content: String!
    }
        
    type Query {
      messages: [Message!]
    }

    type Mutation {
      postMessage(user: String!, content: String!): ID!
    }
  `,
  resolvers: {
    Query: {
      messages: () => messages,
    },
    Mutation: {
      postMessage: (parent, {user, content}) => {
        const id = messages.length;
        messages.push({
          id,
          user,
          content,
        });
        return id;
      }
    },
  }
})