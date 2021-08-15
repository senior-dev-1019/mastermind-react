import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Auth from '../Layouts/Auth';
import Login from '../../pages/Login/index';
import { getCookie } from '../../utils/cookie';
import { APP_ROOT } from '../../configs/appConfig';
import Dashboard from '../../pages/Admin/Dashboard';
import { meData } from '../../redux/actions/auth';
import { notificationPermissions } from '../../utils/alerts';


class AuthRoutes extends Component {
  componentWillMount(){
    if(!getCookie('authenticated')){
      return 
    }
    meData();
  }
  componentDidMount(){
    notificationPermissions();
  }
  render() {
    return (
      <Auth>
        <Switch>
          <Route path={`${APP_ROOT}/`} component={Login} />
        </Switch>
      </Auth>
    );
  }
}
export default AuthRoutes;