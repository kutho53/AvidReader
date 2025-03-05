
// create our typeDefs
const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: ID
    description: String
    title: String
    image: String
    link: String
    authors: [String]
  }
  type Query {
    me: User
  }
  input bookData {
    bookId: ID
    description: String
    title: String
    image: String
    link: String
    authors: [String]
  }
  type Mutation {
      login(email: String!, password: String!): Auth
      addUser(username: String!, email: String!, password: String!): Auth
      saveBook(input: bookData): User
      removeBook(bookId: ID!): User
  }
  type Auth {
      token: ID!
      user: User
  }
`;

// export the typeDefs
export default typeDefs;