import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import styles from './ShiftManager-jss.js';
import ShiftManager from './ShiftManager';

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state.auth
})

const ShiftManagerConnected = connect(mapStateToProps, mapDispatchToProps)(ShiftManager)
export default withStyles(styles)(ShiftManagerConnected)