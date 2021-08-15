import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  Fab,
  Menu,
  MenuItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Settings from '@material-ui/icons/Settings';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import styles from './Header-jss';
import { logout } from '../../redux/actions/auth';
import { APP_ROOT } from '../../configs/appConfig';
import { hasAdminAccess } from '../../utils/cookie';

class Header extends Component {
  triggerLogout(){
    this.props.logout();
  }

  render() {
    const { classes, isAdmin } = this.props;
    return (
      <AppBar color="default" className={isAdmin ? classes.adminAppBar : classes.appBar}>
        <Toolbar className={classes.flexToolbar}>
          <Hidden smDown>
            <div></div>
          </Hidden>
          <img src={`${APP_ROOT}/images/mastermind.png`} className={classes.logo} style={{marginLeft: '259px'}}/>

          <Hidden smDown>
            <div className={classes.menuContainer}>
              {hasAdminAccess() && <Link className={classes.fabIcon} to="/app"><Fab color="default" variant="round" ><Settings /></Fab></Link>}
              <Fab style={{marginLeft:10}} onClick={() => this.triggerLogout()} color="default" variant="round" ><PowerSettingsNew /></Fab>
            </div>
          </Hidden>
          <Hidden smUp>
            <Fab color="secondary" size="small" aria-label="add" >
              <MenuIcon />
            </Fab>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}
const mapStateToProps = state => ({
  ui : state.ui,
});

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
});

const HeaderConnected = connect(mapStateToProps, mapDispatchToProps)(Header);

export default withStyles(styles)(HeaderConnected);