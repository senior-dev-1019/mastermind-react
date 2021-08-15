import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { request } from '../utils/request';

export default class About extends Component {
  componentWillMount(){
    // const me = request('https://my-json-server.typicode.com/typicode/demo/profile', {}).then(({ data, status })  => {
    //   console.log(data, status)
    // })
    // console.log(me)
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>About</title>
        </Helmet>
        About <Link to="/">Home</Link>
      </div>
    );
  }
}
