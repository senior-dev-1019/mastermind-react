import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import brand from '../../utils/brand';
import { TextField, Button } from '@material-ui/core';
import { login } from '../../redux/actions/auth';
import Swal from 'sweetalert2';
import { error } from "../../utils/alerts";
import { APP_ROOT } from '../../configs/appConfig';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  login(){
    const { email, password } = this.state;
    if(!email || !password){
      return Swal.fire('Authentication Error', 'Email and password are required', 'error');
    }
    login({ email, password }).then(({ data }) => {
      if(data.status){
        this.props.authenticate(data.user);
        this.props.history.push(`${APP_ROOT}/app`);
      }else{
        Swal.fire('Authentication Error', data.message, 'error');
      }
    }).catch((e) => {
      error(e.response.data.errors);
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Helmet>
          <title> Login - {brand.name}</title>
          <link rel="icon" href="/images/logo.png" sizes="32x32" />
        </Helmet>
        <div className={classes.root}>
          <div className={classes.logoContainer}>
            <img className={classes.logo} src={`${APP_ROOT}/images/mastermind.png`} alt={brand.name} />
          </div>
          <div className={classes.loginForm}>
            <TextField
              label="Email"
              type="text"
              margin="normal"
              name="email"
              fullWidth
              variant="outlined"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              margin="normal"
              name="password"
              fullWidth
              variant="outlined"
              value={this.state.password}
              onChange={event => this.setState({ password: event.target.value })}
            />
            <div className={classes.buttonContainer}>
              <Button size="large" onClick={() => this.login()} fullWidth variant="contained" color="primary" >Log in</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;