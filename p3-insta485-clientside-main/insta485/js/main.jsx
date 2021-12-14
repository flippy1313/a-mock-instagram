import React from 'react';
import ReactDOM from 'react-dom';
import ShowPosts from './showposts';

// This method is only called once
ReactDOM.render(
  // Insert the post component into the DOM
  <ShowPosts url="/api/v1/posts/" />,
  document.getElementById('reactEntry'),
);
