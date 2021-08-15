import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import styles from './EndReports-jss.js';
import EndReports from './EndReports';

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state.auth,
})

const EndReportsConnected = connect(mapStateToProps, mapDispatchToProps)(EndReports);
export default withStyles(styles)(EndReportsConnected);