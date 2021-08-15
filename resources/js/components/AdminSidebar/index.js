import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { call } from '../../redux/actions/calling';
import styles from './Sidebar-jss';
import Sidebar from './Sidebar';

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = state => ({

});

const SidebarConnected = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
export default withStyles(styles)(SidebarConnected);
