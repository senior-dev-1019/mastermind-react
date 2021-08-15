import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import styles from './Statistics-jss.js';
import Statistics from './Statistics';

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state.auth
})

const StatisticsConnected = connect(mapStateToProps, mapDispatchToProps)(Statistics)
export default withStyles(styles)(StatisticsConnected)