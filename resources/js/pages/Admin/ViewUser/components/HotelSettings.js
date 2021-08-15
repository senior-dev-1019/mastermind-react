import React, { Component, Fragment } from 'react';
import {
  Paper,
  TextField,
  Button
} from '@material-ui/core';
import Loading from '../../../../components/Loading';
import { withStyles } from '@material-ui/core/styles';
import { submitSettings } from '../../../../redux/actions/admin';
import styles from './Style-jss';
import Panel from '../../../../components/Panel';
import { error, success, errors } from '../../../../utils/alerts';

class ChangeEmail extends Component {
  constructor(props){
    super(props);
    this.state = {
      turnon: this.props.user.get('turnon') || '',
      turnoff: this.props.user.get('turnoff') || '',
      panelOpen: true,
      loading: false
    };
  }

  handleSubmit() {
    if((this.state.turnon && !this.state.turnoff) || (!this.state.turnon && this.state.turnoff)){
      return error('You can submit both fields empty or both with a value');
    }
    submitSettings({
      user_id: this.props.user.get('id'),
      turnon: this.state.turnon,
      turnoff: this.state.turnoff
    }).then(({ data }) => {
      if(data.status) {
        success('Hotel Settings Updated!');
      } else {
        errors(data.errors);
      }
    });
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
    //   this.setState({ loading: true });
    //   changeEmail(this.props.user.get('id'), this.state.email).then(({ data }) => {
    //     this.setState({ loading: false });
    //     if (data.status) {
    //       success('Email address Updated');
    //     } else {
    //       error(data.message);
    //     }
    //     return;
    //   });
    // }
    // return error('Invalid email address');
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.content} elevation={3}>
        <Panel
          title="Hotel Settings"
          onToggleCollapse={() => this.setState({ panelOpen: !this.state.panelOpen })}
          collapsed={this.state.panelOpen}
        >
          {this.state.loading && <Loading />}
          {!this.state.loading && (
            <Fragment>
              <TextField
                className={classes.TextField}
                onChange={(e) => this.setState({ turnon: e.target.value })}
                type="time"
                fullWidth
                variant="outlined"
                label="Turn on time"
                value={this.state.turnon}
                shrink
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                className={classes.TextField}
                onChange={(e) => this.setState({ turnoff: e.target.value })}
                type="time"
                fullWidth
                variant="outlined"
                label="Turn off time"
                value={this.state.turnoff}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Button color="primary" variant="contained" onClick={() => this.handleSubmit()} fullWidth>Save</Button>
            </Fragment>
          )}
        </Panel>
      </Paper>
    );
  }
}
export default withStyles(styles)(ChangeEmail);
