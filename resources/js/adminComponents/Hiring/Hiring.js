import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './Hiring-jss';
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
    Grid
} from '@material-ui/core'

class Hiring extends Component {
    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
               <Helmet>
                    <title>Hiring</title>
                    <link rel="icon" href="/images/logo.png" sizes="32x32" />
                </Helmet> 
                <div className={classes.content}>
                    <div className={classes.contentSelf}>
                        <a target="_blank" className={classes.reference} href="https://drive.google.com/open?id=1PFj8zUHTp2p0UdveeAPaHCI6WTbYiQs_">Hiring process diagramm</a><br/>
                        <a target="_blank" className={classes.reference} href="https://drive.google.com/open?id=1KeUtxDDN2PKksyJG-Cb9DHA04Uqi3W21">Job description</a><br/>
                        <a target="_blank" className={classes.reference} href="https://docs.google.com/spreadsheets/d/1q7nd6L88m7UD66DAonIZFZ_panY4gs3Xc0x7qKMQmKM/edit#gid=0">Test</a><br/>
                        <a target="_blank" className={classes.reference} href="https://play.google.com/apps/publish/?account=8003933314494374887#ManageReleaseTrackPlace:p=com.pampuni.mastermind&appid=4975408153738191255&releaseTrackId=4698528445530596682">Google play</a><br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Hiring)