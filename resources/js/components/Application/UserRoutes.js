import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import User from '../Layouts/User';
import { getCookie } from '../../utils/cookie';
import Home from '../../pages/Home';
import { notificationPermissions } from '../../utils/alerts';
import { meData } from '../../redux/actions/auth';
import Dashboard from '../../pages/Admin/Dashboard';
import Login from '../../pages/Login/index';
import { APP_ROOT } from '../../configs/appConfig';

class UserRoutes extends Component {
  componentWillMount(){
    if(!getCookie('authenticated')){
      return window.location.replace('/');
    }
    meData();
  }
  componentDidMount(){
    notificationPermissions();
  }
  render() {
    return (
      <User>
        <Switch>
          <Route path={`${APP_ROOT}/`} component={Login} />
        </Switch>
      </User>
    );
  }
}
export default UserRoutes;