import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Call from '@material-ui/icons/Call';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import {
	Tabs,
	Tab,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	IconButton
} from '@material-ui/core'

import classnames from 'classnames';
import styles from './Sidebar-jss';
import moment from 'moment';
import { getCookie } from '../../utils/cookie';
import Loading from '../Loading';

class SideBarContent extends Component {
	constructor(props){
		super(props);
		this.state = {
			activeTab: 0
		}
		this.userId = getCookie('id');
	}
	//callsLoading
	renderCalls() {
		const { classes, calls, callsLoading } = this.props;

		if(callsLoading){
			return (
				<div style={{ height: 400 }}>
					<Loading />
				</div>
			);
		} else {
			if(calls && calls.size == 0){
				return (
					<div style={{ textAlign: 'center', height: 400, display: 'flex', justifyContent: 'center', alighItems: 'center' }}>
						No calls
					</div>
				);
			}
		}
		return (
			<List  >
				{calls && calls.map((call, index) => {
					let callType = '';
					let caller = '';
					let idToCall= '';
					// outgoing
					if(this.userId == call.get('id_caller') ){
						callType = 'outgoing';
						caller = call.get('receiver_name');
						idToCall = call.get('id_receiver');
					}else{
						callType = 'incoming';
						caller = call.get('caller_name');
						idToCall = call.get('id_caller');
					}

					return (
						<ListItem
							//  onClick={() => this.props.call(idToCall, caller)}
							className={((call.get('answered') == 2 || call.get('answered') == 3) && callType == 'incoming') ? classnames( classes.listItemCall, classes.missedCall ) : classes.listItemCall}
							button
							key={`call-${index}`}
						>
							<ListItemText
								primary={`${caller} - ${(call.get('answered') == 2 || call.get('answered') == 3) && callType == 'incoming' ? 'MISSED' : callType.toUpperCase()}`}
								secondary={moment(call.get('start_time')).format('hh:mma DD/MM/YYYY')}
							/>
						</ListItem>
					)
				})}
			</List>
		);
	}

	renderContacts(){
		const { classes, contacts, contactsLoading } = this.props;
		if(contactsLoading){
			return (
				<div style={{ height: 400 }}>
					<Loading />
				</div>
			);
		}
		if(contacts.size == 0){
			return (
				<div style={{ textAlign: 'center', height: 400, display: 'flex', justifyContent: 'center', alighItems: 'center' }}>
					No contacts
				</div>
			);
		}
		return (
			<List>
				{contacts.map((contact, index) => {
					return (
						<ListItem className={classes.listItemCall} button key={`contact-${index}`}  style={{borderRight: '1px solid #ddd'}} >
							<ListItemText primary={`${contact.get('name')}`} secondary={contact.get('email')}  style={{borderRight: '1px solid #ddd'}} />
							<ListItemSecondaryAction  style={{borderRight: '1px solid #ddd'}} >
								<IconButton  style={{borderRight: '1px solid #ddd'}}  onClick={() => this.props.call(contact.get('id'), contact.get('name'))} color="primary"><Call /></IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					)
					})}
			</List>
		);
	}
	render() {
		const { classes, calls, contacts } = this.props;

		return (
			<div className={classes.SidebarContentRoot}>
				<Tabs style={{borderRight: '1px solid #ddd'}}
					onChange={(ev, activeTab) => this.setState({ activeTab })}
					variant="fullWidth"
					indicatorColor="secondary"
					textColor="secondary"
					value={this.state.activeTab}
				>
					<Tab classes={{ root: classes.minWidth }} icon={<Call />} label="Calls" />
					<Tab classes={{ root: classes.minWidth }} icon={<AssignmentInd />} label="Contacts" />
				</Tabs>
				<div className={classes.sidebarContent} style={{borderRight: '1px solid #ddd'}}>
				{this.state.activeTab === 0 && this.renderCalls()}
				{this.state.activeTab === 1 && this.renderContacts()}
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(SideBarContent);