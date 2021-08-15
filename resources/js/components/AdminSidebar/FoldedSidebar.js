import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { getIconByRole, getStatusButton } from '../../utils/constants';
import { Drawer, Hidden, List, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './FoldedSidebar-jss';
import SideBarContent from './SidebarContent';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
  
 class FoldedSidebar extends Component {
  drowerContent(){
    const { classes } = this.props;
    const name = this.props.user.auth.get('name')
    const role = this.props.user.auth.get('role');
    const isPrivileged = role == 2 || role == 10;  

    return (
      <div style={{textAlign: 'center'}}>
        <Hidden xsDown>
        <i className="fas fa-th icon-2x" style={{color:'white', fontSize: '20px', marginTop: '30px', cursor: 'pointer'}} onClick={()=>this.props.showTabBar()}></i>
          <div className="sidebar-user-info" style={{marginTop: '35px'}}>
          
            <a href="#" className="user-link" >
              <i className={`fas ${getIconByRole(this.props.user.auth.get('role'))} icon-2x`} 
              style={{marginRight: '15px', marginLeft: '15px',  'borderRadius': '50%', fontSize: '30px', border: '4px', color: 'white'}}>
              </i>
            </a>
          </div>
      
          {/* <hr className={classes.divider} /> */}
          <List className={classes.menu}>
            <MenuItem onClick={()=>this.props.history.push('/app')}className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-home"></i></a></MenuItem>

            <MenuItem onClick={()=>this.props.history.push('/app/shift-manager')}className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-clock"></i></a></MenuItem>
            <MenuItem onClick={()=>this.props.history.push('/app/statistics')}className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-chart-bar"></i></a></MenuItem>

            {isPrivileged && <div>
              <MenuItem onClick={()=>this.props.history.push('/app/calls')} className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-phone"></i></a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/users')} className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-user-friends"></i></a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/video-config')} className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-video"></i></a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/end-reports')}  className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-passport"></i></a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/hiring')} className={classes.menuItem}><a className={classes.menuHref}><i className="fas fa-user-plus"></i></a></MenuItem>

            </div>}
      
            {/* <MenuItem onClick={()=>this.props.history.push('/app')} className={classes.menuItem}><a><i className="fas fa-tachometer-alt"></i> Dashboard</a></MenuItem> */}
    
          </List>

        </Hidden>

      </div>
    )
  }
  render() {
    const { classes } = this.props;
    return (
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css" >
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
const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state,
})
const FoldedSideBarConnected = connect(mapStateToProps,mapDispatchToProps)(FoldedSidebar)
export default withRouter(withStyles(styles)(FoldedSideBarConnected));
