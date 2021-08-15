import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from '../Layouts/Admin';
import { getCookie, hasAdminAccess } from '../../utils/cookie';
import Dashboard from '../../pages/Admin/Dashboard';
import ViewUser from '../../pages/Admin/ViewUser';
import ViewEndReport from '../../pages/Admin/ViewEndReport';
import { APP_ROOT } from '../../configs/appConfig';
import { notificationPermissions } from '../../utils/alerts';
import { meData } from '../../redux/actions/auth';
import VideoSettings from '../../adminComponents/VideoSettings'
import Users from '../../adminComponents/Users'
import Hiring from '../../adminComponents/Hiring'
import Calls from '../../adminComponents/Calls'
import EndReports from '../../adminComponents/EndReports'
import ShiftManager from '../../adminComponents/ShiftManager'
import Statistics from '../../adminComponents/Statistics'

class Administration extends Component {
  componentWillMount(){
    if(!getCookie('authenticated')){
      return window.location.replace(`${APP_ROOT}/`);
    }
    meData();
	}

  componentDidMount(){
    notificationPermissions();
  }
  render() {
    return (
      <Admin>
        <Switch>
          <Route path={`${APP_ROOT}/app`} exact component={Dashboard} />
          <Route path={`${APP_ROOT}/app/shift-manager`} exact component={ShiftManager} />
          <Route path={`${APP_ROOT}/app/statistics`} exact component={Statistics} />
          <Route path={`${APP_ROOT}/app/user/:id`} exact component={ViewUser} />
          <Route path={`${APP_ROOT}/app/video-config`} exact component={VideoSettings} />
          <Route path={`${APP_ROOT}/app/users`} exact component={Users} />
          <Route path={`${APP_ROOT}/app/hiring`} exact component={Hiring} />
          <Route path={`${APP_ROOT}/app/calls`} exact component={Calls} />
          <Route path={`${APP_ROOT}/app/end-reports`} exact component={EndReports} />
          <Route path={`${APP_ROOT}/app/end-report/:id`} exact component={ViewEndReport} />
        </Switch>
      </Admin>
    );
  }
}
export default Administration;