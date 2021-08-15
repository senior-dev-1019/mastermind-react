import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	Paper,
	AppBar,
	Toolbar,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import People from '@material-ui/icons/People';
import { createUser } from '../../redux/actions/admin';
import styles from './Users-jss';
import { error, success } from '../../utils/alerts';
import { bindActionCreators } from 'redux';
import { getIconByRole, getRoleById, statusBtn } from '../../utils/constants';
import { getUsers } from '../../redux/actions/admin';
import { connect } from 'react-redux';
import { request } from '../../utils/request';
import { ALL_USERS_URL, CHANGE_USER} from '../../redux/actions/adminRoutes'
import axios from 'axios';
import {withRouter} from 'react-router'

class EditUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
      email: '',
      name: '',
      password: '',
      role: 0,
      users: []
		}
	}

  handleSubmit() {
    const {name, email, role, password, user_id} = this.state;

    const data = {
      name, 
      email, 
      role, 
      user_id,
      password,
    };

    request(CHANGE_USER, data)
    .then(x => {
      success('User was successfully modified');
     this.props.history.push('/app/users')
    })
  }
  
	componentDidMount() {
    if(this.state.users.length == 0)
    {
      request(ALL_USERS_URL, {})
        .then(x => {
          this.setState({
            users: x.data.users
          })
          const { currentUser } = this.props
          const currentUserId = currentUser.get('id');
          var foundUser =  this.state.users.find(x => x.id== currentUserId)
          
          this.setState({
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            user_id: foundUser.id  
          })
      })
    }
	}

	render(){
    const { classes } = this.props;
    return (
      <Dialog
        fullWidth
        open={this.props.open}
        onClose={() => this.props.handleClose()}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <People />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Edit User
            </Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.props.handleClose()}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.modalContent}>
          <TextField
            label="Email"
            fullWidth
            value={this.state.email}
            type="email"
            onChange={(e) => this.setState({email: e.target.value})}
            variant="outlined"
            className={classes.input}
          />
          <TextField
            label="Name"
            fullWidth
            value={this.state.name}
            type="text"
            onChange={(e) => this.setState({name: e.target.value})}
            variant="outlined"
            className={classes.input}
          />
          <TextField
            label="Password"
            fullWidth
            value={this.state.password}
            type="password"
            onChange={(e) => this.setState({password: e.target.value})}
            variant="outlined"
            className={classes.input}
          />
          <FormControl variant="outlined" fullWidth className={classes.input}>
        		<InputLabel>User type</InputLabel>
						<Select
							fullWidth
							onChange={(e) => this.setState({ role: e.target.value })}
							value={this.state.role}
							labelWidth={90}
						>
							<MenuItem value={0}>Hotel</MenuItem>
							<MenuItem value={1}>Reception</MenuItem>
							<MenuItem value={2}>Manager</MenuItem>
							<MenuItem value={10}>Admin</MenuItem>
						</Select>
					</FormControl>
          <Button className={classes.input} onClick={() => this.handleSubmit()} fullWidth color="primary" variant="contained" size="medium">Submit</Button>
        </div>
      </Dialog>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getUsers: bindActionCreators(getUsers, dispatch),
});

const mapStateToProps = state => ({
  user: state.auth,
  users: state.users.get('users'),
  loading: state.users.get('loading'),
  filters: state.users.get('filters')
});

const EditUserConnected = connect(mapStateToProps, mapDispatchToProps)(EditUser)
export default withRouter(withStyles(styles)(EditUserConnected));
