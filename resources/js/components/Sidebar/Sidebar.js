import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Drawer, Hidden } from '@material-ui/core';

import styles from './Sidebar-jss';
import SideBarContent from './SidebarContent';

 class SideBar extends Component {
  drowerContent(){
    const { classes, calls, contacts, call, callsLoading, contactsLoading } = this.props;

    return (
      <div>
        <Hidden smDown>
          <div className={classes.mainMenu}>Main Menu</div>
        </Hidden>
        <SideBarContent
          calls={calls}
          contacts={contacts}
          call={(id, name) => call(id, name)}
          callsLoading={callsLoading}
          contactsLoading={contactsLoading}
        />
      </div>
    )
  }
  render() {
    const { classes } = this.props;
    return (
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={'left'}
            classes={{
              paper: classes.drawerPaper,
            }}
            open={false}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}

          >
            {this.drowerContent()}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {this.drowerContent()}
          </Drawer>
        </Hidden>
      </nav>
    );
  }
}

export default withStyles(styles)(SideBar);
