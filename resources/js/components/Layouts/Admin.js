import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Pusher from 'pusher-js';
import Header from '../AdminHeader';
import Calling from '../Calling';
import { getCookie } from '../../utils/cookie';
import { someoneIsCalling, answer, reject, stopCall, endCall, endCallWithBusy, getCall } from '../../redux/actions/calling';
import { pusherLog } from '../../redux/actions/calls';
import Swal from 'sweetalert2';
import { stopIncoming } from '../../utils/sounds';
import { notify } from '../../utils/alerts';
import history from '../../utils/history';
import AdminSidebar from '../AdminSidebar';
import FoldedSidebar from '../AdminSidebar/FoldedSidebar';
import {Animated} from 'react-animated-css';
const styles = theme => ({
  root: {
    display: 'flex'
  },
  appContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  footer: {
    position: 'fixed',
    // marginLeft: '260px',
    width: '100%',
    bottom: '0px',
    textAlign: 'center',
    borderTop: 'solid 1px #ddd',
    background: 'white',
    // zIndex: 9999,
    padding: '7px',
    color: '#607D8B',
    boxShadow: '7px -8px 20px #ddd',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: '0px',
    },
  }
});

window.pusher = new Pusher('139799596b265605692f', {
  cluster: 'us2',
  forceTLS: false
});

class User extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabFocus: true,
      isTabBarHidden: false
    }
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount(){
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur', this.onBlur);
  }

  onFocus(){
    this.setState({tabFocus: true});
  }

  onBlur(){
    this.setState({tabFocus: false});
  }

  componentWillMount(){
    const { stopCall } = this.props;
    let me = getCookie('id');
    if(!me){
      return window.location.replace('/');
    }
    let myname = getCookie('name');
    let channel = window.pusher.subscribe(me);
    let authChannel = window.pusher.subscribe('auth');
    channel.bind('call', (data) => {
      try{
        pusherLog(data);
        window.focus();
      }catch(e){
        console.log(e);
      }
      if(this.props.calling.getIn(['activeCall', 'id_call']) || this.props.calling.getIn(['incommingCall', 'id_call']) ){
        endCallWithBusy({
          id_call: data.id_call,
          name_caller: getCookie('name'),
          id_target: data.id_caller,
          action: 'busy'
        });
        return Swal.fire({
          text: `${data.name_caller} called you!`,
          type: 'info',
          showConfirmButton: false,
					timer: 5000
				});
      }
      if( !this.state.tabFocus ) {
        notify(`${data.name_caller} is calling you!`, '')
      }
      this.props.someoneIsCalling(data);
    });
    channel.bind('hang_up', (data) => {
      try{
        pusherLog(data);
      }catch(e){
        console.log(e);
      }
      if(data.reason == "call_ended"){
        if (this.props.calling.getIn(['activeCall', 'id_call']) == data.id_call || this.props.calling.getIn(['incommingCall', 'id_call']) == data.id_call ) {
          stopCall();
          stopIncoming();
          return Swal.fire({
            text: `Call closed by caller`,
            showConfirmButton: false,
            toast: true,
            type: 'info',
            position:'bottom-end',
            timer: 6000
          });
        }
      }
      if(data.reason == "alreadyAnswered" && this.props.calling.getIn(['incommingCall', 'id_call']) == data.id_call){
        stopCall();
        stopIncoming();
        return Swal.fire({
          text: `${data.name_caller} answered a pending call!`,
          showConfirmButton: false,
          toast: true,
          type: 'info',
          position:'bottom-end',
          timer: 8000
        });
      }else{
        if(this.props.calling.getIn(['activeCall', 'id_call']) == data.id_call || this.props.calling.getIn(['incommingCall', 'id_call']) == data.id_call ){
          stopCall();
          stopIncoming();
          return Swal.fire({
            text: `Call ended`,
            showConfirmButton: true,
            toast: true,
            type: 'info',
            position:'bottom-end',
            timer: 8000
          });
        }
      }
    })

    authChannel.bind('user_online', (data) => {
      if(data.user != myname){
        Swal.fire({
          text: ` ${data.user} is ${data.state ? 'online' : 'offline' }`,
          showConfirmButton: false,
          toast: true,
          type: 'info',
					position:'bottom-end',
					timer: 8000
				})
      }
    });
  }
  endCall(){
    const { endCall, calling } = this.props;
    endCall({
      id_call: calling.getIn(['incommingCall', 'id_call']),
      name_caller: getCookie('name'),
      id_target: calling.getIn(['incommingCall', 'id_caller']),
      action: 'reject'
    });
  }

  answer(call){
    getCall(call.get('id_call')).then(({ data }) => {
      try{
        if(data.call.answered != 0){
          stopIncoming();
          this.props.stopCall();
          Swal.fire({
            text: ` Call Missed or closed by caller...`,
            showConfirmButton: true,
            toast: true,
            type: 'warning',
            position:'bottom-end',
            timer: 8000
          });

        }else{
          this.props.answer(call);
          history.push('/app');
        }
      }catch(e){
        pusherLog([{call: call, error: e}]);
        this.props.answer(call);
        history.push('/app');
      }
    });
  }

  hideTabbar() {
    this.setState({
      isTabBarHidden: true
    })
  }

  showTabbar() {
    this.setState({
      isTabBarHidden: false
    })
  }

  render() {
    const { classes, children, calling, user } = this.props;
    return (
      <div className={classes.root}>
        
        <Header
          showTabBar={()=>this.showTabbar()} 
          hideTabBar={()=>this.hideTabbar()}
          isHidden={this.state.isTabBarHidden}
        />
        
        {!this.state.isTabBarHidden && <AdminSidebar 
          showTabBar={()=>this.showTabbar()} 
          hideTabBar={()=>this.hideTabbar()}
          isHidden={this.state.isTabBarHidden}
          />}

        {this.state.isTabBarHidden && <FoldedSidebar 
          showTabBar={()=>this.showTabbar()} 
          hideTabBar={()=>this.hideTabbar()}
          isHidden={this.state.isTabBarHidden}
          style={{width:'100px'}} 
          />}

        <main className={classes.appContent}>
          <div className={classes.toolbar} />
          {children}
        </main>
        {calling.get('ringing') && (
          <Calling
            ringing={calling.get('ringing')}
            incommingCall={calling.get('incommingCall')}
            user={user}
            answer={( call ) => this.answer(call)}
            reject={() => this.endCall()}
          />
        )}
        <div className={classes.footer}>
           Powered by Mastermind &copy; 2019 Mastermind | <a href="https://master-mind.co">master-mind.co</a> | <a href="mailto:info@master-mind.co">info@master-mind.co</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  calling: state.calling,
  user: state.auth
});
const mapDispatchToProps = dispatch => ({
  someoneIsCalling: bindActionCreators(someoneIsCalling, dispatch),
  answer: bindActionCreators(answer, dispatch),
  reject: bindActionCreators(reject, dispatch),
  stopCall: bindActionCreators(stopCall, dispatch),
  endCall: bindActionCreators(endCall, dispatch)
});
const UserConnected = connect(mapStateToProps, mapDispatchToProps)(User);
export default withStyles(styles)(UserConnected);