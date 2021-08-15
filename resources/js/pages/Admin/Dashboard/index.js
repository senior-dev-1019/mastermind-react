import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import styles from './Dashboard-jss';
import Dashboard from './Dashboard';

const mapDispatchToProps = dispatch => ({
});

const mapStateToProps = state => ({
  user: state.auth,
});
const DashboardConnected = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default withStyles(styles)(DashboardConnected);
