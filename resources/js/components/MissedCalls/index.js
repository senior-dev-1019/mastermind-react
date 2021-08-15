import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { call } from '../../redux/actions/calling';
import styles from './MissedCalls-jss';
import MissedCalls from './MissedCalls';

const mapDispatchToProps = dispatch => ({
  call: bindActionCreators(call, dispatch),
});

const mapStateToProps = state => ({
  calls: state.calls.get('missed'),
  user: state.auth
});
const MissedCallsConnected = connect(mapStateToProps, mapDispatchToProps)(MissedCalls);
export default withStyles(styles)(MissedCallsConnected);
