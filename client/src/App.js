import logo from './logo.svg';
import './App.css';
import { ApolloClient , gql, InMemoryCache , useQuery } from '@apollo/client'

// const client = new ApolloClient({
//   uri: 'http://localhost:8000/graphql',
//   cache: new InMemoryCache(),
// });

const query = gql`
  query GetTodos {
    getAllTodos{
      id
      title
      completed
      user {
        name
        email
      }
    }
  }
`

function App() {

  const { data , loading , error } = useQuery(query)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="App">
      <table>
        <tbody>
          {
            data.getAllTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.completed ? 'Completed' : 'Not Completed'}</td>
                <td>{todo.user.name}</td>
                <td>{todo.user.email}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
