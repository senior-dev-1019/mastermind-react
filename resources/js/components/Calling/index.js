import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Fab
} from '@material-ui/core';
import Call from '@material-ui/icons/Call';
import CallEnd from '@material-ui/icons/CallEnd';
import styles from './Calling-jss';

class Calling extends Component {
	constructor(props){
		super(props);
		this.state = {
			countdown: 30
		}
	}
	componentDidMount(){
		const that = this;
		this.interval = setInterval(() => {
			let { countdown } = that.state;
			countdown = countdown - 1;
			if(countdown === 0){
				that.props.reject({});
				clearInterval(this.interval);
			}
			that.setState({ countdown });
		}, 1000);
	}

	componentWillUnmount(){
		if(this.interval){
			clearInterval(this.interval);
		}
	}
	render() {
		const { classes, ringing, incommingCall, user } = this.props;
		return (
			<Dialog
				open={ringing}
			>
				<DialogTitle>
          {`${incommingCall.get('name_caller')} is calling...`}
        </DialogTitle>
				<DialogContent dividers>
					<h2 className={classes.countdown}>{this.state.countdown}</h2>
					<Typography className={classes.actionsContainer} gutterBottom>
            <Fab onClick={() => this.props.answer(incommingCall)} classes={{ root: classes.answerBtn }}><Call /></Fab>
            <Fab onClick={() => this.props.reject()} classes={{ root: classes.rejectBtn }}><CallEnd /></Fab>
          </Typography>
				</DialogContent>
			</Dialog>
		)
	}
}
export default withStyles(styles)(Calling);