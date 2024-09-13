import { gql } from "@apollo/client";

export const GET_TODO = gql`
  query GetTodo($id: ID!) {
    todo(id: $id) {
      id
      name
      description
    }
  }
`

export const LIST_TODOS = gql`
  query ListTodos {
    todos {
      id
      name
      description
    }
  }
`

export const CREATE_TODO = gql`
  mutation CreateTodo($data: CreateTodoInput!) {
    createTodo(data: $data) {
      ... on Todo {
        id
        name
        description
      }
      ... on CreateTodoError {
        message
      }
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateTodo($data: UpdateTodoInput!) {
    updateTodo(data: $data) {
      ... on Todo {
        id
        name
        description
      }
      ... on UpdateTodoError {
        message
      }
    }
  }
`

export const SEARCH_TODO = gql`
  query SearchTodos($data: SearchInput!) {
  search(data:$data) {
    results {
      id
      name
      description
    }
  }
}
`