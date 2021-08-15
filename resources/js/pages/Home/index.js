import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCalls, getContacts, listMissingCalls, removeMissedCall, loading } from '../../redux/actions/calls';
import { endCall, stopCall } from '../../redux/actions/calling';
import { setOnline } from '../../redux/actions/auth';
import styles from './Home-jss';
import Home from './Home';

const mapDispatchToProps = dispatch => ({
    getCalls: bindActionCreators(getCalls, dispatch),
    endCall: bindActionCreators(endCall, dispatch),
    setOnline: bindActionCreators(setOnline, dispatch),
    getContacts: bindActionCreators(getContacts, dispatch),
    listMissingCalls: bindActionCreators(listMissingCalls, dispatch),
    removeMissedCall: bindActionCreators(removeMissedCall, dispatch),
    stopCall: bindActionCreators(stopCall, dispatch),
    loading: bindActionCreators(loading, dispatch),
});

const mapStateToProps = state => ({
    user: state.auth,
    calls: state.calls.get('calls'),
    calling: state.calling,
});
const HomeConnected = connect(mapStateToProps, mapDispatchToProps)(Home);
export default withStyles(styles)(HomeConnected);
