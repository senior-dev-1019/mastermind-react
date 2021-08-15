import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import check_in from '../../../../../images/check_in.png'
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { viewEndReport } from '../../../redux/actions/admin'
import styles from './ViewEndReport-jss';
import { getReportLink } from '../../../utils/constants';
import { setCrumbs, deleteCrumb } from '../../../redux/actions/ui';
import Accessibility from '@material-ui/icons/Accessibility';
import Error from '@material-ui/icons/Error'
import moment from 'moment';

class ViewEndReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      end_report_id: null,
      endReport: {},
      endReportCalls: [],
      endReportLoading: false,
    }
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ endReportLoading: true, end_report_id: id });
    this.viewEndReport(id);
  }
  componentWillUnmount() {
    deleteCrumb(1)
  }

  viewEndReport(id) {
    const that = this;
    viewEndReport(id).then(({ data }) => {
      if (data.status) {
        setCrumbs(1,{
          title: data.report.id,
          url: `/app/end-report/${data.report.id}`
        });
        // console.log(data.report);
        that.setState({ endReport: data.report, endReportCalls: data.calls, endReportLoading: false });
      }
    });
  }

  componentWillUpdate(props, oldProps) {
    const { id } = props.match.params;
    if(this.state.end_report_id && id != oldProps.end_report_id) {
      this.setState({ endReportLoading: true, end_report_id: id }, () => {
        this.viewEndReport(id);
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <title>{this.state.endReport ? `View End Report - ${this.state.endReport.id}` : 'Admin Dashboard'}</title>
          <link rel="icon" href="/images/logo.png" sizes="32x32" />
        </Helmet>
        <div className={classes.content}>
          <div className="container" style={{marginTop : '60px'}}>
            <h1 className={classes.header}>Report {getReportLink(this.state.endReport.id)}</h1>
            <h4 className={classes.subHeader}>{this.state.endReport.date} - {moment(this.state.endReport.time, 'H:m').utcOffset(-4).format('HH:mm')} - {this.state.endReport.user_name} -
            {this.state.endReport.number_of_calls} calls
            {this.state.endReport.was_check_in && <img src={check_in} style={{margin: '-7px 0px 0px 10px', width: '30px'}} alt="Check in"/>}
            {this.state.endReport.was_tech_issue && <Error style={{margin: '-7px 0 0 0'}} />}
            </h4>
            {!this.state.endReportLoading && this.state.endReportCalls.map(function (call, index) {
              return <section className={classes.calls} key={index + 1}>
                <h5 className={classes.callHeader}>{index + 1}. {call.type === 'Check in' ? <span style={{color: 'green'}}>{call.type}</span> : call.type} - {call.time} - {call.hotel}
                {call.room !== null && <span>- RM# {call.room}</span>}</h5>
                <h5 className={classes.callBody}>{call.is_tech_issue ? <strong>{call.message}</strong> : call.message}</h5>
              </section>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ViewEndReport);
