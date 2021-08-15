import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import styles from './EndReports-jss';
import { getReports } from '../../redux/actions/admin';
import { List, fromJS } from 'immutable';
import Loading from '../../components/Loading';
import Pagination from "material-ui-flat-pagination";
import { getReportLink } from '../../utils/constants';
import {
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
} from '@material-ui/core';
import Accessibility from '@material-ui/icons/Accessibility';
import Error from '@material-ui/icons/Error'
import check_in from '../../../../images/check_in.png'
import moment from 'moment';


class ReportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelOpen: true,
            reports: List([]),
            loading: false,
            offset: 0,
            total: 0
        }
    }
    componentDidMount() {
        this.setState({ loading: true, user_id: this.props.user_id });
        this.getReports(this.state.offset);
    }

    handleClick(offset) {
        this.setState({ offset });
        this.getReports(offset);
    }

    componentWillUpdate(props, stateProps) {
        if(stateProps.user_id && props.user_id != stateProps.user_id) {
            this.setState({ user_id: props.user_id }, () => {
                this.handleClick(0);
            });
        }
    }

    getReports(offset) {
        const that = this;

        getReports({ user: this.props.user_id, offset: offset }).then(({ data }) => {
            that.setState({ reports: fromJS(data.reports), total: data.total,loading: false });
        });
    }

    renderReportBody() {
        const { reports, loading } = this.state;
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={6}><Loading /></TableCell>
                </TableRow>
            )
        }
        if (reports.size === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6}>No reports</TableCell>
                </TableRow>
            )
        }

        return reports.map((report, index) => {
            return (
                <TableRow key={`report-${report.get('id')}`} key={`report_${report.get('id')}`}>
                    <TableCell>
                        <Fragment>
                            <Link to={`/app/end-report/${report.get('id')}`}>{getReportLink(report.get('id'))}</Link>
                        </Fragment>
                    </TableCell>
                    <TableCell>{report.get('date')}</TableCell>
                    <TableCell>{moment(report.get('time'), 'H:m').utcOffset(-4).format('HH:mm')}</TableCell>
                    <TableCell>{report.get('user_name')}</TableCell>
                    <TableCell>
                        {report.get('was_check_in') && <img src={check_in} style={{width: '30px'}} alt="Check in"/>}
                        {report.get('was_tech_issue') && <Error/>}
                    </TableCell>
                </TableRow>
            );
        })
    }

    renderReports() {
        const { classes } = this.props;
        return (
            <Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Report #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Receptionist</TableCell>
                            <TableCell>Notifications</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderReportBody()}
                    </TableBody>
                </Table>
                <Pagination
                    className={classes.pagination}
                    classes={{ textSecondary: classes.activePage }}
                    limit={10}
                    offset={this.state.offset}
                    total={this.state.total}
                    onClick={(e, offset) => this.handleClick(offset)}
                    centerRipple
                />
            </Fragment>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className="fa fa-passport" color="inherit" aria-label="menu">
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            End Reports
                        </Typography>
                    </Toolbar>
                </AppBar>
                {this.state.loading && <Loading />}
                {!this.state.loading && this.renderReports()}
            </Paper>
        )
    }
}

export default withStyles(styles)(ReportList);
