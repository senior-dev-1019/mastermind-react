import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { call } from '../../../redux/actions/calling'
import {
  Grid
} from '@material-ui/core';

import Loading from '../../../components/Loading';
import Users from '../../../adminComponents/Users';
import VideoSettings from '../../../adminComponents/VideoSettings';
import Home from '../../../pages/Home'
import Sidebar from '../../../components/Sidebar'
import SidebarContent from '../../../components//Sidebar/SidebarContent'

class Dashboard extends Component {

  render() {
    const { classes, calls, contacts, call, callsLoading, contactsLoading } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>Admin Dashboard</title>
          <link rel="icon" href="/images/logo.png" sizes="32x32" />
        </Helmet>
        <div className={classes.content} style={{display: 'flex'}}>
          <div className={classes.sidebarPositioned}>
            <SidebarContent
              calls={calls}
              contacts={contacts}
              call={(id, name) => call(id, name)}
              callsLoading={callsLoading}
              contactsLoading={contactsLoading}
              />
          </div>
          <div className={classes.homeBlock}>
            <Home className={classes.noScrollBar}/> 
          </div>
            
          
          {/* <Grid container spacing={2}>
            <Grid item sm={12} md={8} lg={8}>
              <Users />
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              <VideoSettings />
            </Grid>
          </Grid> */}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  call: bindActionCreators(call, dispatch)
});

const mapStateToProps = state => ({
  calls: state.calls.get('calls'),
  contacts: state.calls.get('contacts'),
  callsLoading: state.calls.get('callsLoading'),
  contactsLoading: state.calls.get('contactsLoading'),
});
const DashboardConnected = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default DashboardConnected;
