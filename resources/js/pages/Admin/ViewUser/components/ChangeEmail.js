import React, { Component, Fragment } from 'react';
import {
  Paper,
  TextField,
  Button
} from '@material-ui/core';
import Loading from '../../../../components/Loading';
import { withStyles } from '@material-ui/core/styles';
import { changeEmail } from '../../../../redux/actions/admin';
import styles from './Style-jss';
import Panel from '../../../../components/Panel';
import { error, success } from '../../../../utils/alerts';

class ChangeEmail extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: this.props.user.get('email') || '',
      panelOpen: false,
      loading: false
    };
  }

  handleSubmit() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
      this.setState({ loading: true });
      changeEmail(this.props.user.get('id'), this.state.email).then(({ data }) => {
        this.setState({ loading: false });
        if (data.status) {
          success('Email address Updated');
        } else {
          error(data.message);
        }
        return;
      });
    }
    return error('Invalid email address');
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.content} elevation={3}>
        <Panel
          title="Email"
          onToggleCollapse={() => this.setState({ panelOpen: !this.state.panelOpen })}
          collapsed={this.state.panelOpen}
        >
          {this.state.loading && <Loading />}
          {!this.state.loading && (
            <Fragment>
              <TextField
                className={classes.TextField}
                onChange={(e) => this.setState({ email: e.target.value })}
                type="email"
                fullWidth
                variant="outlined"
                label="New Email"
                value={this.state.email}
              />
              <Button color="primary" variant="contained" onClick={() => this.handleSubmit()} fullWidth>Submit</Button>
            </Fragment>
          )}
        </Panel>
      </Paper>
    );
  }
}
export default withStyles(styles)(ChangeEmail);
