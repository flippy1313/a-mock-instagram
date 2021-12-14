import React from 'react';
import PropTypes, { func } from 'prop-types';


class Comment extends React.Component{
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(e){
        this.props.handleDelete(this.props.commentid)
        fetch(this.props.url,{ credentials: 'same-origin','method':'DELETE'})
          .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .catch((error) => console.log(error));
          e.preventDefault();
    }
    render(){
        const owner = this.props.owner;
        const lognameOwnsThis = this.props.lognameownsThis;
        const text = this.props.text;
        const url = this.props.url
        const ownerShowUrl = this.props.ownershowurl

        if(lognameOwnsThis){
            return (
            <div><p>
            <a href={ownerShowUrl}>{owner}</a>
            {text}
            </p>
            <button onClick={this.handleDelete}
              className="delete-comment-button"
              type = "button"
            >
                Delete comment
            </button></div>
            
            );
        }
        else{
            return (
            <p>
            <a href={ownerShowUrl}>{owner}</a>
            {text}
            </p>
            );
        }
    }
}

export default Comment;