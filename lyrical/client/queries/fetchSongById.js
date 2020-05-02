import gql from "graphql-tag";

// song id is required - use ! to indicate that
export default gql`
  query FindSongById($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {
        id
        content
      }
    }
  }
`;
