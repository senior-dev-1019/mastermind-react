import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  CardActions,
  Collapse
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Loading from '../../../../components/Loading';
import styles from './Style-jss';


class Settings extends Component {


  renderUserCard() {
    const { classes, user } = this.props;

    return (
      <Card >
      </Card>
    )
  }
  render() {
    const { classes, loading, user } = this.props;
    return (
      <div className={classes.root}>
        {loading && <Loading />}
        {!loading && this.renderUserCard()}
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
