import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { register } from '../../redux/actions/auth';
const styles = theme => ({
	loginForm: {
		padding: '10px 32px'
	},
});

class RegisterForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			password_confirmation: ''
		};
	}

	handleChange(key, value){
		this.setState({[key]: value});
	}

	register(){
		register(this.state).then(resp => {
			console.log(resp)
		});
	}
	render() {
		const { classes } = this.props;
    return (
      <div className={classes.loginForm}>
        <TextField
          label="First Name"
          type="text"
          margin="normal"
          fullWidth
					variant="outlined"
					onChange={event => this.handleChange('first_name', event.target.value)}
					value={this.state.first_name}
        />
        <TextField
          label="Last Name"
          type="text"
          margin="normal"
          fullWidth
					variant="outlined"
					onChange={event => this.handleChange('last_name', event.target.value)}
					value={this.state.last_name}
        />
        <TextField
          label="Email"
          type="email"
          margin="normal"
          fullWidth
					variant="outlined"
					onChange={event => this.handleChange('email', event.target.value)}
					value={this.state.email}
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
					variant="outlined"
					onChange={event => this.handleChange('password', event.target.value)}
					value={this.state.password}
        />
        <TextField
          label="Password Confirmation"
          type="password"
          margin="normal"
          fullWidth
					variant="outlined"
					onChange={event => this.handleChange('password_confirmation', event.target.value)}
					value={this.state.password_confirmation}
        />
        <div className={classes.buttonContainer}>
          <Button size="large" onClick={() => this.register()} fullWidth variant="contained" color="primary" >Register</Button>
        </div>
      </div>
    );
	}
}

export default withStyles(styles)(RegisterForm);
