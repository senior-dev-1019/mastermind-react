import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import {
	Paper,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button
} from '@material-ui/core';

import Videocam from '@material-ui/icons/Videocam';
import styles from './VideoSettings-jss';
import { videoResolutions } from '../../utils/constants';
import { getSettings, saveSettings } from '../../redux/actions/admin';
import { success } from '../../utils/alerts';
import Loading from '../../components/Loading';
import Swal from 'sweetalert2';

class VideoSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			speakers_vol: 200,
			mic_vol: 20,
			res_width: 160,
			res_height: 120,
			loading: false
		};
	}
	componentDidMount() {
		getSettings().then(({ data }) => {
			this.setState({
				speakers_vol: data.speakers_vol,
				mic_vol: data.mic_vol,
				res_width: data.res_width,
				res_height: data.res_height
			})
		})
	}

	submit(){
		this.setState({ loading: true });
		if(this.state.speakers_vol && this.state.mic_vol && this.state.res_width && this.state.res_height) {
			Swal.fire({
				title: 'Are you sure?',
				text: `You want to change Video Settings`,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, change it!'
			}).then((result) => {
				if (result.value) {
					saveSettings({
						speakers_vol: this.state.speakers_vol,
						mic_vol: this.state.mic_vol,
						res_width: this.state.res_width,
						res_height: this.state.res_height
					}).then(({ data }) => {
						if(data.status) {
							success('Video Settings Updated');
						}
						this.setState({ loading: false });
					})
				}else{
					this.setState({ loading: false });
				}
			});
		}
	}
	handleChangeRes(val) {
		const data = val.split('x');
		this.setState({
			res_width: data[0],
			res_height: data[1]
		})
	}
	render() {
		const { classes } = this.props;
		return (
			<Paper className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							<Videocam />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Video Settings
						</Typography>
					</Toolbar>
				</AppBar>
				<div className={classes.mainContent}>
					{this.state.loading && <Loading />}
					{!this.state.loading && (
						<Fragment>
							<TextField
								className={classes.input}
								fullWidth
								type="number"
								label="Speaker Volume"
								min="0"
								max="100"
								variant={"outlined"}
								value={this.state.speakers_vol}
								onChange={(e) => this.setState({ speakers_vol: e.target.value })}
							/>
							<TextField
								className={classes.input}
								fullWidth
								type="number"
								label="Mic Volume"
								min="0"
								max="100"
								variant={"outlined"}
								value={this.state.mic_vol}
								onChange={(e) => this.setState({ mic_vol: e.target.value })}
							/>
							<FormControl variant="outlined" fullWidth className={classes.formControl}>
								<InputLabel>Resolution</InputLabel>
								<Select
									fullWidth
									onChange={(e) => this.handleChangeRes(e.target.value)}
									className={classes.input}
									value={`${this.state.res_width}x${this.state.res_height}`}
									labelWidth={90}
								>
									{videoResolutions.map((val, index) => <MenuItem key={index} value={val}>{val}</MenuItem>)}
								</Select>
							</FormControl>
							<Button variant="contained" onClick={() => this.submit()} fullWidth color="primary">Submit</Button>
						</Fragment>
					)}
				</div>
			</Paper>
		)
	}
}

VideoSettings.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VideoSettings);

