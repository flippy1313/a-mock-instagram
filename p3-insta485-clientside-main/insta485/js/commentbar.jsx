import React, { Fragment } from 'react';
import PropTypes, { func } from 'prop-types';


class Commentbar extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            owner: "",
            lognameOwnsThis: false,
            text: "",
            postid: 0,
        };
        this.handleText = this.handleText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const postid = this.props.postid;
        this.setState({
            postid: postid
        })
    }

    handleText(event){
        this.setState({text: event.target.value});
    }

    handleSubmit(e){
        const comment_info = []
        const requestOption={ credentials: 'same-origin', 
                        'method': "POST" ,
                        headers : {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({text : this.state.text})
                    }
        fetch("/api/v1/comments/?postid="+this.state.postid, requestOption)
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .then((data) => {
            this.props.handleText(data);
          })
          .catch((error) => console.log(error));
          this.setState({text:""})
          e.preventDefault();
    }

    render(){
    return(
          <form className="comment-form" onSubmit={this.handleSubmit}>
            <input  
              type="text"
              value={this.state.text}
              onChange={this.handleText}

            />
            <input
              type="submit"
              value="submit"
            />
          </form>
    );
    }
}

export default Commentbar;
