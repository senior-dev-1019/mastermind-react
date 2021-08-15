import React, { Component } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Fab
} from '@material-ui/core';
import Call from '@material-ui/icons/Call';
import Close from '@material-ui/icons/Close';
import moment from 'moment';

class MissedCalls extends Component {

  render() {
    const { classes, calls, user } = this.props;
    return (
      <div className={classes.root}>
        <List className={classes.listItems}>
          {calls.size > 0 && calls.map((item, index) => {
            return (
              <ListItem button className={classes.listItem} key={`missed-${index}`} >
                <ListItemText primary={`${item.get('caller_name')}`} secondary={`${moment(item.get('start_time')).format('hh:mma DD/MM/YYYY')}`} />
                <ListItemSecondaryAction>
                  <Fab size="small" onClick={() => this.props.removeMissedCall(item.get('id_caller'))} color="secondary"><Close /></Fab>&nbsp;
                  <Fab size="small" onClick={() => this.props.call( item.get('id_caller'), item.get('caller_name') )} color="primary"><Call /></Fab>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
          {calls.size === 0 && (
            <ListItem button >
              <ListItemText primary={`No missed calls`} style={{ textAlign: 'center' }} />
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}

export default MissedCalls;
