const { User, Thought} = require('../../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')
const resolvers = {
  Query: {

    me: async (parent, args, context) => {
      if (context.user) {
      const userData = await User.findOne({})
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends')

        return userData;

        /* But wait, how is this method supposed to read the request headers? By default, the headers aren't available to a resolver. Even though you can add a third parameter, commonly called context, to the method—e.g., (parent, args, context)—you must define what that context is.
        
        open server and scroll to server variable where we need to make a new instance of ApolloServer that can pass in a context method that's set to return whatever you want in the resolvers.*/
    }
    throw new AuthenticationError('Not Logged in')
  },
    // get all users
users: async () => {
  return User.find()
    .select('-__v -password')
    .populate('friends')
    .populate('thoughts');
},
// get a user by username
user: async (parent, { username }) => {
  return User.findOne({ username })
    .select('-__v -password')
    .populate('friends')
    .populate('thoughts');
},
thoughts: async (parent, { username }) => {
  const params = username ? { username } : {};
  return Thought.find(params).sort({ createdAt: -1 });
},
thought: async (parent, { _id }) => {
  return Thought.findOne({ _id });
},
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user }
      //Here, the Mongoose User model creates a new user in the database with whatever is passed in as the args.
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }
      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      if(context.user) {
        const thought  = await Thought.create({...args, username: context.user.username})

        await User.findByIdAndUpdate(
          {_id: context.user._id},
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!')
    },
    addFriend: async (perent, {friendId}, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId }},
          { new: true }
        ).populate('friends')

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  }
}
  module.exports = resolvers;