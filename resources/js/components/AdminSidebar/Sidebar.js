import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { getIconByRole, getStatusButton } from '../../utils/constants';
import { Drawer, Hidden, List, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './Sidebar-jss';
import SideBarContent from './SidebarContent';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
  
 class SideBar extends Component {
  drowerContent(){
    const { classes } = this.props;
    const name = this.props.user.auth.get('name')
    const role = this.props.user.auth.get('role');
    const isPrivileged = role == 2 || role == 10;  

    return (
      <div>
     
        <Hidden xsDown>
          <div className={classes.mainMenu}><a href="/app"><img src={`/images/mastermind.png`} className={classes.logo} /></a>
            <i className="fas fa-arrow-left" style={{marginRight: '15px', color:'white', cursor: 'pointer'}} onClick={()=>this.props.hideTabBar()}></i>
          </div>
          <div className="sidebar-user-info">
          
            <a href="#" className="user-link" style={{marginTop:'25px'}}>
              <i className={`fas ${getIconByRole(this.props.user.auth.get('role'))} icon-2x`} 
                style={{marginLeft: '25px', fontSize: '30px', color: 'white', float: 'left'}}>
              </i>
              <div className={classes.textBlock}>
                <span className={classes.welcomeBlock}>Welcome,</span><br/>
                <span className={classes.usernameBlock}>{name}</span>
              </div>
            </a>
          </div>
      
          <hr className={classes.divider} />
          <List className={classes.menu}>
            <MenuItem onClick={()=>this.props.history.push('/app')} className={classes.menuItem}><a><i className="fas fa-home"></i> Main</a></MenuItem>

            <MenuItem onClick={()=>this.props.history.push('/app/shift-manager')}className={classes.menuItem}><a><i className="fas fa-clock"></i> Shift manager</a></MenuItem>
            <MenuItem onClick={()=>this.props.history.push('/app/statistics')}className={classes.menuItem}><a><i className="fas fa-chart-bar"></i> Statistics</a></MenuItem>

            {isPrivileged && <div>
              <MenuItem onClick={()=>this.props.history.push('/app/calls')} className={classes.menuItem}><a><i className="fas fa-phone"></i> Calls</a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/users')} className={classes.menuItem}><a><i className="fas fa-user-friends"></i> Users</a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/video-config')} className={classes.menuItem}><a><i className="fas fa-video"></i> Video config</a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/end-reports')}  className={classes.menuItem}><a><i className="fas fa-passport"></i> End reports</a></MenuItem>
              <MenuItem onClick={()=>this.props.history.push('/app/hiring')} className={classes.menuItem}><a><i className="fas fa-user-plus"></i> Hiring</a></MenuItem>

            </div>}
      
            {/* <MenuItem onClick={()=>this.props.history.push('/app')} className={classes.menuItem}><a><i className="fas fa-tachometer-alt"></i> Dashboard</a></MenuItem> */}
    
          </List>
          <List className={classes.bottomBlock}>
            <span>December feedbacks</span>
            <table className={classes.tabletg}>
              <thead>
                <tr>
                  <th className={classes.tableheader}>Receptionist</th>
                  <th className={classes.tableheader}>Number of feedbacks</th>
                  <th className={classes.tableheader}>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={classes.tablebody}>Li</td>
                  <td className={classes.tablebody}>23</td>
                  <td className={classes.tablebody}>
                    <img src="/images/face1.png" width="32px" height="32px" />
                  </td>
                </tr>
                <tr>
                  <td className={classes.tablebody}>Rose</td>
                  <td className={classes.tablebody}>42</td>
                  <td className={classes.tablebody}>
                    <img src="/images/face5.png" width="32px" height="32px" />
                  </td>
                </tr>
                <tr>
                  <td className={classes.tablebody}>Miriam</td>
                  <td className={classes.tablebody}>16</td>
                  <td className={classes.tablebody}>
                    <img src="/images/face2.png" width="32px" height="32px" />
                  </td>
                </tr>
              </tbody>
            </table>
          </List>

        </Hidden>

      </div>
    )
  }
  render() {
    const { classes } = this.props;
    return (
      <nav className={classes.drawer} aria-label="mailbox folders" >
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
const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state,
})
const SideBarConnected = connect(mapStateToProps,mapDispatchToProps)(SideBar)
export default withRouter(withStyles(styles)(SideBarConnected));

/*
const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state.auth,
})

const EndReportsConnected = connect(mapStateToProps, mapDispatchToProps)(EndReports);
export default withStyles(styles)(EndReportsConnected);


*/