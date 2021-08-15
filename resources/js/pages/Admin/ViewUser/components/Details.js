import React, { Component, Fragment } from 'react';
import {
  Paper,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  CardActions,
  Fab,
  Button,
  Tooltip
} from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import Lock from '@material-ui/icons/Lock';
import Home from '@material-ui/icons/Home';
import Refresh from '@material-ui/icons/Refresh';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Loading from '../../../../components/Loading';
import { withStyles } from '@material-ui/core/styles';
import styles from './Style-jss';
import { getRoleById } from '../../../../utils/constants';
import ChangePassword from './ChangePassword';
import HotelSettings from './HotelSettings';
import moment from 'moment';
import ChangeEmail from './ChangeEmail';
import { isAdmin } from '../../../../utils/cookie';
import { hotelSettings, hotelHome, hotelLock, hotelRefresh, deleteAccount } from '../../../../redux/actions/admin';
import { success } from '../../../../utils/alerts';
import Swal from 'sweetalert2';
import EditUser from '../../../../adminComponents/Users/EditUser'
const showFirstLetter = (string) => {
  if (string && string.length > 0) {
    return string[0].toUpperCase();
  }
  return 'US';
}
class Details extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      editModal: false
    }
  }

  settings() {
    this.setState({ loading: true });
    hotelSettings(this.props.user.get('id')).then(res => {
      success('Settings menu is open!');
      this.setState({ loading: false });
    });
  }

  hotelHome() {
    this.setState({ loading: true });
    hotelHome(this.props.user.get('id')).then(res => {
      success('Done!');
      this.setState({ loading: false });
    });
  }

  hotelLock() {
    this.setState({ loading: true });
    hotelLock(this.props.user.get('id')).then(res => {
      success('Done!');
      this.setState({ loading: false });
    });
  }

  hotelRefresh() {
    this.setState({ loading: true });
    hotelRefresh(this.props.user.get('id')).then(res => {
      success('Done!');
      this.setState({ loading: false });
    });
  }

  deleteAccount() {
    this.setState({ loading: true });
    const { user } = this.props;
    const that = this;
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to remove ${user.get('name')}?!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        deleteAccount(user.get('id')).then(res => {
          Swal.fire(
            'Deleted!',
            'The user has been deleted.',
            'success'
          )
          that.props.history.push('/app');
        });
      }
      that.setState({ loading: false });
    })
  }
	handleEditorClosed() {
		this.setState({ editModal: false})
	}
  renderUserCard() {
    const { classes, user } = this.props;
    const role = getRoleById(user.get('role'));
    return (
      // <Card className={classes.card}>
      <div>
        <CardHeader
          className={classes[`cardHotel`]}
          avatar={
            <Avatar className={classes.avatar}>
              {showFirstLetter(user.get('name'))}
            </Avatar>
          }
          title={`${user.get('name')}`}
          subheader={`${role}`}
        />
        <CardContent>
          {user.get('role') == 1 && (
            <p className={classes.paragraph}>Working State:  {user.get('reception') ? 'Online' : 'Offline' }</p>
          )}
          {user.get('email') && (
            <p className={classes.paragraph}>Email:  {user.get('email')}</p>
          )}
          <p className={classes.paragraph}>Last active: {moment(user.get('active')).format('DD MMMM YYYY hh:mm A')}</p>
        </CardContent>
        <CardActions>
          {user.get('role') == 0 && (
            <div>
              <Tooltip title="Open Device Settings"><Fab size="small" onClick={() => this.settings()} color="primary"><Settings /></Fab></Tooltip>
              <Fab size="small" onClick={() => this.hotelHome()} color="secondary" className={classes.icon}><Home /></Fab>
              <Fab size="small" onClick={() => this.hotelLock()} color="inherit" className={classes.icon}><Lock /></Fab>
              <Fab size="small" onClick={() => this.hotelRefresh()} color="primary" className={classes.icon}><Refresh /></Fab>
         
            </div>
          )}
            {
              isAdmin() && <Fab size="small" 
                onClick={() => this.setState({editModal: true})} 
                color="primary" 
                className={classes.icon}>
                  <i className="fas fa-user-edit"></i>
              </Fab>
            }
            { isAdmin() && <Fab onClick={() => this.deleteAccount()} size="small" color="primary" className={classes.deleteForever}><DeleteForever /></Fab>}
          <div>{this.state.loading && <Loading />}</div>
        </CardActions>
        </div>
    )
  }

  updateUser(user) {

  }

  render() {
    const { classes, loading } = this.props;
    console.log(this.props.user.get('role'))
    return (
      <div className={classes.root}>
        <Paper className={classes.content} elevation={3}>
          {loading && <Loading />}
          {!loading && this.renderUserCard()}
          {(!loading && isAdmin() && (this.props.user.get('role') == 0)) && <HotelSettings user={this.props.user} />}
          {/* {(!loading && this.props.user.get('role') == 0) && <HotelSettings user={this.props.user} />}
          {(!loading && isAdmin()) && <ChangePassword user={this.props.user} />}
          {(!loading && isAdmin()) &&  <ChangeEmail user={this.props.user} />} */}
        </Paper>
				{this.state.editModal && (
					<EditUser currentUser={this.props.user}
						open
            handleClose={() => this.handleEditorClosed()}
					/>
				)}
      </div>
    );
  }
}
export default withStyles(styles)(Details);
