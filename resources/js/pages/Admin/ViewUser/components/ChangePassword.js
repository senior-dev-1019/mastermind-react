import React, { Component, Fragment } from 'react';
import {
  Paper,
  TextField,
  Button
} from '@material-ui/core';
import Loading from '../../../../components/Loading';
import { withStyles } from '@material-ui/core/styles';
import styles from './Style-jss';
import Panel from '../../../../components/Panel';
import { changePassword } from '../../../../redux/actions/admin';
import { error, success } from '../../../../utils/alerts';


class ChangePassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      new_password: '',
      panelOpen: false,
    }
  }
  handleSubmit() {
    if (this.state.new_password.length >= 6 ) {
      this.setState({ loading: true });
      changePassword(this.props.user.get('id'), this.state.new_password).then(({ data }) => {
        this.setState({ loading: false });
        if (data.status) {
          success('User Password Updated');
        } else {
          error(data.message);
        }
        return;
      });
    }
    return error('The password should have more than 5 characters');
  }
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.content} elevation={3}>
        <Panel
          title="Change Password"
          onToggleCollapse={() => this.setState({ panelOpen: !this.state.panelOpen })}
          collapsed={this.state.panelOpen}
        >
          {this.state.loading && <Loading />}
          {!this.state.loading && (
            <Fragment>
              <TextField
                className={classes.TextField}
                onChange={(e) => this.setState({ new_password: e.target.value })}
                type="password"
                fullWidth
                variant="outlined"
                label="New Password"
                value={this.state.new_password}
              />
              <Button color="primary" onClick={() => this.handleSubmit()} variant="contained" fullWidth>Submit</Button>
            </Fragment>
          )}
        </Panel>
      </Paper>
    );
  }
}
export default withStyles(styles)(ChangePassword);
