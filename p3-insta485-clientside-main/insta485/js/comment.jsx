import React from 'react';
import PropTypes from 'prop-types';
import Comment from './onecomment';
import Commentbar from './commentbar';

class ShowComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      postid: 0
    }
    this.handleText = this.handleText.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    }
    handleText(data) {
        const new_comments = this.state.comments;
        new_comments.push(data)
        this.setState({comments: new_comments})
    }
    handleDelete(commentid){
        const new_comments = []; 
        this.state.comments.forEach(comment => {                 
            if(comment.commentid !== commentid){
                new_comments.push(comment)
            }
        });
        this.setState({comments: new_comments})
    }

    componentDidMount() {
        const postid = this.props.postid;
        fetch("/api/v1/posts/"+postid,{ credentials: 'same-origin' })
          .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .then((data) => {
            this.setState({
                comments: data.comments,
                postid: data.postid
            })
          })
          .catch((error) => console.log(error));
    }

    render(){
        const postid = this.props.postid;
        const show = []
        this.state.comments.forEach(comment => {
            show.push(
                <Comment
                commentid={comment.commentid}
                owner={comment.owner}
                lognameownsThis={comment.lognameOwnsThis}
                text={comment.text}
                url={comment.url}
                ownershowurl={comment.ownerShowUrl}
                key={comment.commentid}
                handleDelete={this.handleDelete}
                />
            )               
        });
        if(postid===0){
            return (null);
        }
        return (
            <div>
            {show}
            <Commentbar
            postid={postid}
            handleText={this.handleText}
            />
            </div>
        );
      }
      
}


ShowComment.propTypes = {
    postid: PropTypes.number.isRequired,
  };
  
export default ShowComment;