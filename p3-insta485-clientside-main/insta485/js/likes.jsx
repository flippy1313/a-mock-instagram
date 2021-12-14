import React from 'react';
import PropTypes from 'prop-types';

class Likes extends React.Component {
  /* Display number of like and unlike of a single post
   */

  constructor(props) {
    // Initialize mutable state
    super(props);
    // this.state = { num_likes: 0, lognameLikesThis: false, url: ''};
    this.handleLikeOrUnlike = this.handleLikeOrUnlike.bind(this);
    // this.updateDoubleClick = this.updateDoubleClick.bind(this);
    // this.handleUnlike = this.handleUnlike.bind(this);
  }

  // componentDidMount() {
  //   const { url } = this.props;

  //   // Call REST API to get number of likes
  //   fetch(url, { credentials: 'same-origin' })
  //     .then((response) => {
  //       if (!response.ok) throw Error(response.statusText);
  //       return response.json();
  //     })
  //     .then((data) => {
  //       this.setState({
  //         numLikes: data.numLikes,
  //         lognameLikesThis: data.lognameLikesThis,
  //         url: data.url,
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // }

  handleLikeOrUnlike() {
    console.log(this.props, 'handle like or dislike');
    const pp = this.props;
    const { lognameLikesThis, url } = pp.likes;
    if (lognameLikesThis) {
      //   delete
      fetch(url, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'delete',
      })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          pp.handleUnlike();
        })
        // .then(this.props.handleUnlike())
        .catch((error) => console.log(error));
    } else {
      // console.log("/api/v1/likes/?postid="+this.props.postid)
      fetch(`/api/v1/likes/?postid=${pp.postid}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
      })
        .then((response) => (response.json())
          .then((data) => pp.handleLike(data)));
      // .catch((error) => console.log(error))
    }
  }

  //   updateDoubleClick() {
  //     const {lognameLikesThis, numLikes, url} = this.props;
  //     if(!lognameLikesThis) {
  //       fetch(url, {
  //           credentials: 'same-origin',
  //           headers: {'Content-Type': 'application/json'},
  //           method: 'post',
  //       })
  //       .then((response) => {
  //         if (!response.ok) throw Error(response.statusText);
  //       })
  //       .then(() => {
  //         this.setState({
  //           numLikes : numLikes + 1,
  //           lognameLikesThis : 1,
  //         });
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }

  render() {
    const pp = this.props;
    const { numLikes, lognameLikesThis } = pp.likes;
    return (
      <div className="likes">
        <button
          className="like-unlike-button"
          type="button"
          onClick={this.handleLikeOrUnlike}
        >
          {lognameLikesThis === 0 ? 'like' : 'unlike'}
        </button>
        <p>
          {numLikes}
          {' '}
          like
          {numLikes !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
}

// Likes.propTypes = {
//   postid: PropTypes.number.isRequired,
//   likes: PropTypes.map(PropTypes.string, PropTypes.element).isRequired,
//   handleUnlike: PropTypes.func.isRequired,
//   handleLike: PropTypes.func.isRequired,
// };

export default Likes;
