import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
	Paper,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	InputBase,
	TextField,
	Select,
	MenuItem,
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Tooltip,
	FormControl,
	InputLabel,
	Fab,
	Grid,
	Button
} from '@material-ui/core';

import GroupAdd from '@material-ui/icons/GroupAdd';
import People from '@material-ui/icons/People';
import { getIconByRole, getRoleById, statusBtn } from '../../utils/constants';
import { getUsers } from '../../redux/actions/admin';
import CreateUser from './CreateUser';
import styles from './Users-jss';
import EditUser from './EditUser';

const userRolesByName = {
	"All" : -1,
	"Hotel" : 0,
	"Receptionist": 1,
	"Manager": 2,
	"Admin": 10,
}

const nameByUserRole = {
	"-1" : '12',
	0: "Hotel",
	1: "Receptionist",
	2: "Manager",
	10: "Admin"
}

const statusByName = {
	"All": -1,
	"Offline": 0,
	"Online": 1,
	"Background": 2
}

const nameByStatus = {
	"-1": "All",
	0: "Offline",
	1: "Online",
	2: "Background"
}

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			modalOpen: false,
			editModal: false,
			user: {},
			role: -1,
			is_active: -1,
			updated: new Date(),
		}
	}

	componentDidMount() {
		this.getUsers({});
	}

	handleClose(){
		this.setState({ modalOpen: false });
	}
	handleOpen() {
		this.setState({ modalOpen: true });
	}
	handleChange(key, value){
		const newState = {...this.state};
		newState[key]= value;
		this.setState(newState)
	}

	getUsers(filters) {
		const { getUsers } = this.props;
		getUsers(filters);
	}

	refreshUsers() {
		this.getUsers(this.state);
	}

	handleEditorOpen(user) {
		this.setState({ editModal: true, user})
	}

	handleEditorClosed() {
		this.setState({ editModal: false})
	}

	renderUsers(){
		const { classes } = this.props;
		return this.props.users.map((user, index) => {
			const { name, role, is_active } = this.state
			if((name=='-1' || user.get('name').toLowerCase().includes(name.toLowerCase()))
				&& (role=='-1' || user.get('role')==role)
				&& (is_active=='-1' || is_active==user.get('is_active'))
			) {
				return (
					<TableRow key={user.get('id')}>
						<TableCell>{index + 1}</TableCell>
						<TableCell><Link to={`/app/user/${user.get('id')}`}>{user.get('name')}</Link></TableCell>
						<TableCell className={classes.gray} align="center"><Tooltip title={getRoleById(user.get('role'))}>
							<i className={`fa ${getIconByRole(user.get('role'))} fa-2x`} />
						</Tooltip></TableCell>
						<TableCell className={classes.gray} align="center">{statusBtn(user.get('is_active'))}</TableCell>
						<TableCell className={classes.gray} >{user.get('vc')}</TableCell>
						{/* <TableCell align="center" >
							<Fab size="small" color="primary" onClick={() => this.handleEditorOpen(user)} user={user}><Tooltip title="Edit User"><i className="fa fa-pen"/></Tooltip></Fab>
							<Link className={classes.userLink} to={`/app/user/${user.get('id')}`}><Fab size="small" color="primary"><Tooltip title="View User"><i className="fa fa-eye"/></Tooltip></Fab></Link>
						</TableCell> */}
					</TableRow>
				)
			}
		})
	}

	render() {
		const { classes } = this.props;
		const role = this.props.user.get('role');
		const isPrivileged = role == 10;
		return (
			<Paper className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							<People />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Users
						</Typography>
						{isPrivileged && 
							<Fab size="small" color="primary" onClick={() => this.handleOpen()}><GroupAdd /></Fab>
						}
					</Toolbar>
				</AppBar>
				<div className={classes.filtersContainer}>
						<Grid container spacing={2}>
							<Grid item sm={12} md={4}>
								<TextField
									variant="outlined"
									size="small"
									value={this.state.name}
									onChange={(e) => this.handleChange('name', e.target.value)}
									fullWidth
									label={'Search By name'}
								/>
							</Grid>
							<Grid item sm={12} md={4}>
								<select
									className={classes.selectBox}
									variant="outlined"
									size="small"
									fullWidth
									defaultValue="All"
									value={nameByStatus[this.state.is_active]}
									onChange={(e) => this.handleChange('is_active', statusByName[e.target.value])}
									label={'Search By user type'}
								>
									<option>All</option>
									<option>Online</option>
									<option>Offline</option>
									<option>Background</option>
								</select>
							</Grid>
							<Grid item sm={12} md={4}>
								<select
									className={classes.selectBox}
									variant="outlined"
									size="small"
									fullWidth
									defaultValue="All"
									value={nameByUserRole[this.state.role]}
									onChange={(e) => this.handleChange('role', userRolesByName[e.target.value])}
									label={'Search By user type'}
								>
									<option>All</option>
									<option>Admin</option>
									<option>Manager</option>
									<option>Receptionist</option>
									<option>Hotel</option>
								</select>
							</Grid>
						</Grid>
					</div>
				<div className={classes.mainContent}>

					<Table>
						<TableHead>
							<TableRow>
								<TableCell width={20}>#</TableCell>
								<TableCell>
									User
								</TableCell>
								<TableCell align="center">Type</TableCell>
								<TableCell align="center" width={140}>Status</TableCell>
								<TableCell width={20}>VC</TableCell>
								{/* <TableCell align="center">Actions</TableCell> */}
							</TableRow>
						</TableHead>
						<TableBody>
							{this.renderUsers()}
						</TableBody>
					</Table>
				</div>
				{this.state.modalOpen && (
					<CreateUser
						open
						handleClose={() => this.handleClose()}
						reloadUsers={() => this.refreshUsers()}
					/>
				)}
				{this.state.editModal && (
					<EditUser currentUser={this.state.user}
						open
						handleClose={() => this.handleEditorClosed()}
						reloadUsers={() => this.refreshUsers()}
					/>
				)}
			</Paper>
		)
	}
}

Users.propTypes = {
	classes: PropTypes.object.isRequired,
	getUsers: PropTypes.func.isRequired
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

const UsersMapped = connect(mapStateToProps, mapDispatchToProps)(Users);
export default withStyles(styles)(UsersMapped);
