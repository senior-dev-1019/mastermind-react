import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { call } from '../../redux/actions/calling';
import styles from './Sidebar-jss';
import Sidebar from './Sidebar';

const mapDispatchToProps = dispatch => ({
  call: bindActionCreators(call, dispatch)
});

const mapStateToProps = state => ({
  calls: state.calls.get('calls'),
  contacts: state.calls.get('contacts'),
  callsLoading: state.calls.get('callsLoading'),
  contactsLoading: state.calls.get('contactsLoading'),
});

const SidebarConnected = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
export default withStyles(styles)(SidebarConnected);
