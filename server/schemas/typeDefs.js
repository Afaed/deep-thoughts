// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Query {
    users: [User]
    user(username : String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;

// export the typeDefs
module.exports = typeDefs;

/*mutation {
  addPost(title: "GraphQL Tutorial", body: "Let's learn GraphQL by first installing...") {
    _id
    title
    body
  }
} 

In this example, the mutation—called addPost()—accepts arguments for a title and body. Like with queries, you can specify which properties you want returned. In the case of a mutation, it's usually helpful to have the newly created _id returned.
*/