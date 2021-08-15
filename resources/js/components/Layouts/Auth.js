import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const styles = theme => ({
  root: {
    // background: theme.palette.primary.main,
    background: 'linear-gradient(188deg, #ffffff, #1d9fa0)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSize: {
    width: 500,
  }
});

class Auth extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={2} className={classes.formSize} >
          {this.props.children}
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(Auth);