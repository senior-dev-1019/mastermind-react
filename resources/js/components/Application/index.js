import React from 'react';
import {
  withTheme,
  createMuiTheme, MuiThemeProvider
} from '@material-ui/core/styles';
import { Switch, Route, Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import themePallete from '../../modules/theme/themePalette';
import history from '../../utils/history';
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './Administrator';
import store from '../../redux/store';
import { getCookie } from '../../utils/cookie';
import { APP_ROOT } from '../../configs/appConfig';

class Application extends React.Component {

  render() {
    return (
      <Provider store={store}>
          <MuiThemeProvider theme={createMuiTheme(themePallete('themeOne'))} >
            <Router history={history}>
              <Switch>
                <Route path={`${APP_ROOT}/`} exact component={AuthRoutes} />
                <Route path={`${APP_ROOT}/app`}  component={AdminRoutes} />
              </Switch>
            </Router>
          </MuiThemeProvider>
      </Provider>
    );
  }
}
export default withTheme(Application);