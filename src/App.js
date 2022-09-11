import logo from "./logo.svg";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

const GET_REPO_BY_ID = gql`
  query GetRepoById($id: ID!) {
    GetRepoById(id: $id) {
      id
      name
      description
      fullName
      createdAt
      language
      visibility
    }
  }
`;

const GET_ALL_REPOS = gql`
  query GetAllRepos {
    GetAllRepos {
      id
      name
      description
      fullName
      createdAt
      language
      visibility
    }
  }
`;
function App() {
  // const { loading, error, data } = useQuery(GET_ALL_REPOS, {
  //   variables: { id: "any id" },
  // });
  // const { loading, error, data } = useQuery(GET_REPO_BY_ID);
  // console.log({ data, loading, error });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
