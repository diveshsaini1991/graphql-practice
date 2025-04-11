const express = require("express");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4')
const cors = require('cors');
const axios = require('axios');

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
                user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
            },
            Query: {
                getAllTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async (_, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
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