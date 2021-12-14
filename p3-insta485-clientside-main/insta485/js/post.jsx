import React from 'react';
import PropTypes from 'prop-types';
import ShowComment from './comment';
import Likes from './likes';

class Posts extends React.Component {
  /* Display number of image and post owner of a single post */

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      postid: 0,
      imgUrl: '',
      owner: '',
      ownerImgUrl: '',
      ownerShowUrl: '',
      created: '',
      postShowUrl: '',

      // likes
      likes: {},
      // incase not working
      // lognameLikesThis: 0,
      // numLikes: 0,
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    // this.updateDoubleClick = this.updateDoubleClick(this);
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    const { url } = this.props;

    // Call REST API to get the post's information
    console.log(this.props, 'component');
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          postid: data.postid,
          imgUrl: data.imgUrl,
          owner: data.owner,
          ownerImgUrl: data.ownerImgUrl,
          ownerShowUrl: data.ownerShowUrl,
          created: data.created,
          postShowUrl: data.postShowUrl,
          // likse
          // likes: data.likes
          // incase not working
          likes: data.likes,
        });
      })
      .catch((error) => console.log(error));
  }

  handleLike(LikeIn) {
    console.log(LikeIn);
    // breakpoint()
    this.setState((prevState) => ({
      likes: {
        numLikes: prevState.likes.numLikes + 1,
        lognameLikesThis: 1,
        url: LikeIn.url,
      },
    }));
  }

  handleUnlike() {
    this.setState((prevState) => ({
      likes: {
        numLikes: prevState.likes.numLikes - 1,
        lognameLikesThis: 0,
        url: null,
      },
    }));
  }

  // }
  handleDoubleClick() {
    const st = this.state;
    if (st.likes.lognameLikesThis) return;
    fetch(`/api/v1/likes/?postid=${st.postid}`, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    })
      .then((response) => (response.json())
        .then((data) => this.handleLike(data)));
  }

  // }
  // updateDoubleClick() {
  //   if (this.state.lognameLikesThis) return;
  //   fetch("/api/v1/likes/?postid="+this.state.postid, {
  //     credentials: 'same-origin',
  //     headers: {'Content-Type': 'application/json'},
  //     method: 'post',
  //   })
  //   .then((response) => {
  //     if (!response.ok) throw Error(response.statusText);
  //     this.props.handleDoubleClick(response);
  //   })
  //   .catch((error) => console.log(error));
  //   }

  render() {
    // const showposts = []
    // this.state.results.forEach(result =>{
    //   showposts.push(
    //   )
    // });
    const {
      postid, imgUrl, owner, ownerImgUrl, ownerShowUrl, created,
      postShowUrl, likes,
    } = this.state;

    if (postid === 0) {
      return (null);
    }
    return (
      <div className="posts">
        <p>
          <a href={ownerShowUrl}>
            <img src={ownerImgUrl} alt="owner_img" className="avatar" />
          </a>
          <a href={ownerShowUrl}>
            {owner}
          </a>
          <a href={postShowUrl}>{created}</a>
        </p>
        <p><img src={imgUrl} alt="post" onDoubleClick={this.handleDoubleClick} /></p>
        <Likes
          postid={postid}
          likes={likes}
          handleUnlike={this.handleUnlike}
          handleLike={this.handleLike}
        />
        <ShowComment postid={postid} />
      </div>
    );
  }
}

Posts.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Posts;
