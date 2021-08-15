import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { List, Map, fromJS } from 'immutable';
import {
  Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { viewUser } from '../../../redux/actions/admin'
import styles from './ViewUser-jss';
import Details from './components/Details';
import Calls from '../../../adminComponents/Calls';
import { setCrumbs, deleteCrumb } from '../../../redux/actions/ui';

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      user: Map({}),
      calls: List([]),
      userLoading: false,
    }
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ userLoading: true, user_id: id });
    this.viewUser(id);
  }
  componentWillUnmount() {
    deleteCrumb(1)
  }
  viewUser(id) {
    const that = this;
    viewUser(id).then(({ data }) => {
      if (data.status) {
        setCrumbs(1,{
          title: data.user.name,
          url: `/app/user/${data.user.id}`
        })
        that.setState({ user: fromJS(data.user), userLoading: false });
      }
    });
  }

  componentWillUpdate(props, oldProps) {
    const { id } = props.match.params;
    if(this.state.user_id && id != oldProps.user_id) {
      this.setState({ userLoading: true, user_id: id }, () => {
        this.viewUser(id);
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>{this.state.user ? `View User - ${this.state.user.get('name')}` : 'Admin Dashboard'}</title>
          <link rel="icon" href="/images/logo.png" sizes="32x32" />
        </Helmet>
        <div className={classes.content}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={4} lg={4}>
              <Details
                user={this.state.user}
                loading={this.state.userLoading}
                history={this.props.history}
              />
            </Grid>
            <Grid item sm={12} md={8} lg={8}>
              {this.state.user.get('id') && (
                <Calls user_id={this.state.user.get('id')} />
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ViewUser);
