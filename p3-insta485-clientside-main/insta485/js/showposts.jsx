import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Posts from './post';

class ShowPosts extends React.Component {
  /* Get all the posts to show on the homepage */
  constructor(props) {
    super(props);
    this.state = {
      next: '',
      hasMore: false,
      posts: [],
    };
    this.fetchMoreData = this.fetchMoreData.bind(this);
  }

  componentDidMount() {
    // retrieve data if the user is returning to "/"
    if (String(window.performance.getEntriesByType('navigation')[0].type) === 'back_forward') {
      this.setState({
        next: window.history.state.next,
        hasMore: window.history.state.hasMore,
        posts: window.history.state.posts,
      });
    } else {
      const { url } = this.props;
      fetch(url, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
          // let temp_post = this.state.posts
          // temp_post.concat(data.posts)
          this.setState({
            next: data.next,
            posts: data.results,
          });
          if (data.next !== '') {
            this.setState({ hasMore: true });
          }
        })
        .catch((error) => console.log(error));
      const tempState = this.state;
      window.history.replaceState(tempState, '');
    }
  }

  fetchMoreData() {
    const { next } = this.state;
    fetch(next, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          next: data.next,
          hasMore: true,
        });
        if (data.next === '') {
          this.setState({ hasMore: false });
        }
        const st = this.state;
        const newPosts = st.posts.concat(data.results);
        this.setState({
          posts: newPosts,
        });
      })
      .catch((error) => console.log(error));
    const tempState = this.state;
    window.history.replaceState(tempState, '');
  }

  render() {
    const showposts = [];
    const st = this.state;
    st.posts.forEach((post) => {
      showposts.push(
        <Posts url={post.url} key={post.url} />,
      );
    });

    return (
      <InfiniteScroll
        dataLength={st.posts.length}
        next={this.fetchMoreData}
        hasMore={st.hasMore}
        loader={<h4>Loading...</h4>}
      >
        {showposts}
      </InfiniteScroll>
    );
  }
}

ShowPosts.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ShowPosts;
