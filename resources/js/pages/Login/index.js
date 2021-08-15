import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authenticate } from '../../redux/actions/auth';
import styles from './Login-jss';
import Login from './Login';

const mapDispatchToProps = dispatch => ({
    authenticate: bindActionCreators(authenticate, dispatch)
});

const mapStateToProps = state => ({
    user: state.auth
});
const LoginConnected = connect(mapStateToProps, mapDispatchToProps)(Login);
export default withStyles(styles)(LoginConnected);
