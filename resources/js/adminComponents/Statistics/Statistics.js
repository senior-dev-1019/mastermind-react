import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './Statistics-jss';
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
    Grid
} from '@material-ui/core'

class Statistics extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Statistics</title>
                    <link rel="icon" href="/images/logo.png" sizes="32x32" />
                </Helmet>
                <div>
                    <span>Statistics component</span>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Statistics)