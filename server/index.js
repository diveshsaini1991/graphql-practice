const express = require("express");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4')
const cors = require('cors');
const axios = require('axios');

const { TODOS } = require('./todo');
const { USERS } = require('./user');

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        typeDefs: `
            type User{
                id:ID!
                name:String!
                username:String!
                email:String!
                phone:String!
                website:String!
            }

            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
                user: User
            }
            
            type Query {
                getAllTodos: [Todo]
                getAllUsers: [User]
                getUser(id:ID!):User
            }
        `,
        resolvers: {
            Todo: {
                user: (todo) => USERS.find((user) => user.id === todo.userId)
            },
            Query: {
                getAllTodos: () => TODOS,
                getAllUsers: () => USERS,
                getUser: (_, { id }) => USERS.find((user) => user.id === id)
            }
        }
    });

    await server.start();

    app.use('/graphql', cors(), express.json(),expressMiddleware(server));

    const PORT = process.env.PORT || 8000;
    await new Promise((resolve) => app.listen(PORT, resolve));
    console.log(`Server is running on port ${PORT}`);
}

startServer().catch((err) => {
    console.error('Error starting the server:', err);
});