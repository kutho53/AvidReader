import User from "../models/index.js";
import { UserDocument } from '../models/User';
import { signToken, AuthenticationError } from '../services/auth.js';

interface BookData {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
}

interface Args {
    email?: string;
    password?: string;
    bookData?: BookData;
    bookId?: string;
}

interface Context {
    user?: UserDocument;
  }

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: Context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password') as UserDocument;
                return userData;
            }
            throw new AuthenticationError('Not Logged In');
        }
    },
    Mutation: {
        addUser: async (_parent: any, args: Args) => {
            const user = await User.create(args) as UserDocument;
            const token = signToken(user.username, user.email, user.id);

            return { token, user };
        },
        login: async (_parent: any, { email, password }: Args) => {
            const user = await User.findOne({ email }) as UserDocument;
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPW = await user.isCorrectPassword(password!);
            if (!correctPW) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (_parent: any, { bookData }: Args, context: Context) => {
            if (context.user) {
                const book = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                ) as UserDocument;
                return book;
            }
            throw new AuthenticationError('You need to be logged in');
        },
        removeBook: async (_parent: any, { bookId }: Args, context: Context) => {
            if (context.user) {
                const book = await User.findByIdAndDelete(
                    { _id: context.user._id },
                    { $pull: { saveBook: { bookId } } }
                ) as UserDocument;
                return book;
            }
            throw new AuthenticationError('You need to be logged in');
        },
    }
};
  
 export default resolvers;