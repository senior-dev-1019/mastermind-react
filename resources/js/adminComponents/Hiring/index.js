import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import styles from './Hiring-jss';
import Hiring from './Hiring';

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({
    user: state.auth,
})

const HiringConnected = connect(mapStateToProps, mapDispatchToProps)(Hiring);
export default withStyles(styles)(HiringConnected);