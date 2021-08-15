import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Panel from '../../components/Panel';
import styles from './Calls-jss';
//import { Table, TableHead, TableRow, TableCell, Paper, TableBody, Button } from '@material-ui/core';
import { getCalls, deleteCall } from '../../redux/actions/admin';
import { List, fromJS } from 'immutable';
import { getIconByRole, getStatusButton } from '../../utils/constants';
import moment from 'moment';
import MediaFiles from '../../components/Media';
import Loading from '../../components/Loading';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Pagination from "material-ui-flat-pagination";
import { success } from '../../utils/alerts';
import { isAdmin } from '../../utils/cookie';
import {
	Paper,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	InputBase,
	TextField,
	Select,
	MenuItem,
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Tooltip,
	FormControl,
	InputLabel,
	Fab,
	Grid,
  Button
} from '@material-ui/core';
import Phone from '@material-ui/icons/Phone'


class CalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: true,
      calls: List([]),
      loading: false,
      offset: 0,
      total: 0
    }
  }
  componentDidMount() {
    this.setState({ loading: true, user_id: this.props.user_id });
    this.getCalls(this.state.offset);
  }

  handleClick(offset) {
    this.setState({ offset });
    this.getCalls(offset);
  }

  componentWillUpdate(props, stateProps) {
    if(stateProps.user_id && props.user_id != stateProps.user_id) {
      this.setState({ user_id: props.user_id }, () => {
        this.handleClick(0);
      });
    }
  }

  getCalls(offset) {
    const that = this;
    this.setState({ loading: true });
    getCalls({ user: this.props.user_id, offset: offset }).then(({ data }) => {
      that.setState({ calls: fromJS(data.calls), total: data.total,loading: false });
    });
  }

  deleteCall(call_id) {
    const { offset } = this.state;
    deleteCall(call_id).then(() => {
      this.getCalls(offset);
      success('Call Removed');
    });
  }

  renderCallBody() {
    const { classes, user_id } = this.props;
    const { calls, loading } = this.state;
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6}><Loading /></TableCell>
        </TableRow>
      )
    }
    if (calls.size === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6}>No Calls</TableCell>
        </TableRow>
      )
    }
    console.log(calls)
    return calls.map((call, index) => {
      return (
        <TableRow key={`call-${call.get('id')}`} key={`call_${index}`}>
          <TableCell>{this.state.offset + index + 1}</TableCell>
          <TableCell>
            
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Fragment>
                <Link to={`/app/user/${call.get('id_caller')}`}><i className={`fas ${getIconByRole(call.get('caller_role'))}`}></i> {call.get('caller_name')}</Link>
              </Fragment>
                <i className="fas fa-arrow-right" style={{color: '#bbb', verticalAlign: 'middle', marginTop: 'auto', marginBottom: 'auto'}}></i> 
              </div>
          </TableCell>
          <TableCell>
              <Fragment>
                <Link to={`/app/user/${call.get('id_receiver')}`}><i className={`fas ${getIconByRole(call.get('receiver_role'))}`}></i> {call.get('receiver_name')}</Link>
              </Fragment>
          </TableCell>
          <TableCell>
            {getStatusButton(call.get('answered'))}
          </TableCell>
          <TableCell>
            {moment(call.get('start_time')).format('HH:mm DD.MM.YYYY')}
          </TableCell>
          <TableCell >
            <div className={classes.actionsContainer, "call-buttons-wrapper"}>
              {call.get('record_url') && (
                <Fragment>
                  <MediaFiles 
                    className={'btn-call-play'}
                    title={'Record'}
                    type={'mp4'}
                    file={call.get('record_url')}
                    actionButton={(actionFunc) => (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => actionFunc()}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                  />
                  <a href={`https://adminpanel.master-mind.co/api/call/download/${call.get('id')}`} target="_blank" className="btn btn-xs btn-info clwhite  btn-call-download">
                    <i className="fas fa-cloud-download-alt"></i>
                  </a>
                  <CopyToClipboard text={call.get('record_url')}
                    onCopy={() => success('Copied!')}>
                    <button className="btn btn-xs btn-primary btn-call-copy"><i className="fas fa-copy"></i></button>
                  </CopyToClipboard>
                </Fragment>
              )}
              {call.get('snapshots') && (
                <MediaFiles
                  className={'btn-call-snapshot'}
                  title={'Record'}
                  type={'iframe'}
                  file={call.get('snapshots')}
                  actionButton={(actionFunc) => (
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() => actionFunc()}
                    >
                      <i className="fas fa-images"></i>
                    </button>
                  )}
                />
              )}
              {isAdmin() && <button onClick={() => this.deleteCall(call.get('id'))} className="btn btn-xs btn-danger btn-call-delete"><i className="fas fa-trash"></i></button>}
            </div>
          </TableCell>
        </TableRow>
      );
    })
  }

  renderCalls() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Caller</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderCallBody()}
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
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <Phone/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Call History
          </Typography>
        </Toolbar>
      </AppBar>
          {this.state.loading && <Loading />}
          {!this.state.loading && this.renderCalls()}
      </Paper>
    )
  }
}

export default withStyles(styles)(CalList);
