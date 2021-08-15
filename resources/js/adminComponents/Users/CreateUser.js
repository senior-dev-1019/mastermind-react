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

class CreateUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
      email: '',
      name: '',
      password: '',
      role: 0
		}
	}

  handleSubmit() {
    if(!this.state.email && this.state.role != 0) {
      return error('User email is required');
    }
    if(!this.state.name){
      return error('User Name is required');
    }
    if(this.state.role != 0 && !this.state.password) {
      return error('Managers, Receptionists and admins must have a password to use the application.');
    }
    const { reloadUsers, handleClose } = this.props;
    createUser(this.state).then(({data}) => {
      if(data.status) {
        success('User Created');
        reloadUsers();
        handleClose();
      }else{
        return error(data.message);
      }
    })
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
              Users
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
export default withStyles(styles)(CreateUser);
