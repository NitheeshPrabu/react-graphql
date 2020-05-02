import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router";
import gql from "graphql-tag";

import query from "../queries/fetchSongs";

class SongList extends Component {
  onSongDelete(id) {
    // this way cannot be done in SongCreate, because refetch() will only execute all queries associated
    // with the corresponding component. In SongCreate, no "query" is associated.
    this.props.mutate({ variables: { id } }).then(this.props.data.refetch);

    // can also do this
    // this.props.mutate({ variables: { id }, refetchQueries: [{ query }] });
  }

  renderSongs() {
    return this.props.data.songs.map(({ id, title }) => (
      <li className="collection-item" key={id}>
        <Link to={`/songs/${id}`}>{title}</Link>
        <i className="material-icons" onClick={() => this.onSongDelete(id)}>
          delete
        </i>
      </li>
    ));
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <ul className="collection">{this.renderSongs()}</ul>
        <Link to="/songs" className="btn-floating btn-large red right">
          <i className="material-icons">add</i>
        </Link>
      </div>
    );
  }
}

const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`;

// when wrapping with query, `data` is added to `this.props`
export default graphql(mutation)(graphql(query)(SongList));
