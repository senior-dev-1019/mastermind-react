import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  AppBar,
  Toolbar,
  Button,
  Hidden,
  Fab,
  Dialog,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CameraFront from '@material-ui/icons/CameraFront';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import styles from './Header-jss';
import Breadcrumbs from '../Breadcrumbs';
import { logout } from '../../redux/actions/auth';
import { APP_URL } from '../../configs/appConfig'
import { withRouter } from 'react-router'
import CloseIcon from '@material-ui/icons/Close';
import People from '@material-ui/icons/People';

class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      isModal: false,
      time: this.getGMTRemarkedTime()
    }

    window.setInterval(() => {
      this.setState({time: this.getGMTRemarkedTime()})
    }, 1000)
  }

  getGMTRemarkedTime() {
    let date = new Date();
    let gmtOffset = date.getTimezoneOffset();
    return new Date(date.getTime() + 7230000)
  }

  triggerLogout(){
    this.props.logout();
  }

  goToApp(){
    window.onbeforeunload = "";
    window.location.replace('/app');
  }

  namePipe(input) {
    return (input[0].toUpperCase() + input.substring(1))
      .replace('-', ' ')
  }

  timePipe(time) {
    let hours = time.getUTCHours();
    hours = hours > 9 ? hours : "0" + hours;

    let minutes = time.getUTCMinutes();
    minutes = minutes > 9 ? minutes : "0" + minutes;

    if(time==null)
      return ""
    return `${time.getMonth()+1}/${time.getUTCDate()}/${time.getUTCFullYear()} - ${hours}:${minutes}`;
  }

  render() {
    const { classes, isAdmin, isHidden } = this.props;
    const offsetLeft = !isHidden ? '260px' : '60px'
    return (
      <AppBar color="default" className={isAdmin ? classes.adminAppBar : classes.appBar} onClick={()=>(this.state.isModal ? false : false)}>
        
        <Toolbar className={classes.flexToolbar} style={{marginLeft: offsetLeft}}>
          <Breadcrumbs />
        <div className={classes.middlePosed}>
          <img onClick={()=>this.props.history.push('/app')} src="/images/mastermind.png" style={{height: '59px'}}/>
        </div>
        {/* <img src="/images/mastermind.png" style={{height: 56, marginLeft: 'auto', fontSize: 24, textDecoration:'underline', color: 'blue', fontSize:28}} /> */}
      <span className={classes.timeSpan}>
        Israel local time & date<br/>
        {this.timePipe(this.state.time)}
        </span>
          
        <a href="https://manual.master-mind.co/"
        target="_blank" 
        className={classes.manual}>Manual</a>
          
          <div>
              <Fab className={classes.smallLeftMargin} onClick={() => this.setState({isModal:true}) } color="default" variant="round" style={{outline: 'none'}}>
                <i className="fa fa-concierge-bell fa-2x"title="Reception"></i>
              </Fab>
              {/* <Fab style={{marginLeft:10}} onClick={() => this.goToApp() } color="default" variant="round" ><CameraFront /></Fab> */}
              <Fab className={classes.smallLeftMargin} style={{outline: 'none'}} onClick={() => this.triggerLogout()} color="default" variant="round" >
                <PowerSettingsNew />
              </Fab>
          </div>
        </Toolbar>
        
       {this.state.isModal && (<Dialog
        fullWidth
        open={this.state.isModal}
        //onClose={() => this.props.handleClose()}
      >
        <AppBar position="static">
          <Toolbar className={classes.centerItems}>
            
            <IconButton aria-label="close" className={classes.closeButton} style={{color:'white', fontSize: '20px'}}>
              <i className="fa fa-key" title="Key"></i>
            </IconButton>

            <Typography variant="h6" className={classes.title} style={{textAlign:'center', marginLeft: '4px', marginRight: 'auto'}}>
              Reservation systems
            </Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => this.setState({isModal: false})}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.modalContent}>
            <div className={classes.linkWrapper}>
                <a target="_blank" className={classes.popupLinks} href="https://pc1-srgvvilvth.app10-14.logmein.com/default.html?go=r&wsRcTimeMs=3018&rawtnl=32030948_0&gwsid=_Erzpf4E9xaG56UEs0Fz7b2Ycdq6sj5h"> LogMeIn</a><br/>
                <a target="_blank" className={classes.popupLinks} href="https://www.hotel-wiz.com/login.aspx">Mini-Hotel</a><br/>
                <a target="_blank" className={classes.popupLinks} href="https://on.eviivo.com/Account/Login">Eviivo</a><br/>
                <a target="_blank" className={classes.popupLinks} href="https://hotels.cloudbeds.com/connect/25504#/dashboard">Cloudbeds</a>
            </div>
        </div>
        
      </Dialog>)}

        {/* {this.state.isModal?(<div style={{width:'100%', minHeight: '100%', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden', position: 'fixed', top: '0px'}}>
          <div
            style={{position: 'relative', 
            overflow:'hidden', 
            overflowY: 'auto', 
            padding: '0 10 0 10', 
            margin: '40px auto 0px auto', minWidth:'600px', maxWidth:'600px', minHeight:'600px', maxHeight:'600px',paddingBottom: '10px', backgroundColor:'#fff', borderRadius: '0 0 5 5'}}
          >
            <div style={{textAlign: 'center', minWidth: '100%', backgroundColor: 'green'}}>
              <span style={{marginTop: '24px', paddingBottom: '24px', color:'white', fontSize:'36px', textAlign: 'center'}}>Reservation systems</span>
            </div>
            <div style={{left: '30%', top:'20%', position:'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-between', flexDirection: 'column'}}>
                <a target="_blank" style={{textDecoration:'underline', color: 'blue', fontSize: 28}} href="https://pc1-srgvvilvth.app10-14.logmein.com/default.html?go=r&wsRcTimeMs=3018&rawtnl=32030948_0&gwsid=_Erzpf4E9xaG56UEs0Fz7b2Ycdq6sj5h">LogMeIn</a><br/>
                <a target="_blank" style={{textDecoration:'underline', color: 'blue', fontSize: 28}} href="https://www.hotel-wiz.com/login.aspx">Mini-Hotel</a><br/>
                <a target="_blank" style={{textDecoration:'underline', color: 'blue', fontSize: 28}} href="https://on.eviivo.com/Account/Login">Eviivo</a><br/>
                <a target="_blank" style={{textDecoration:'underline', color: 'blue', fontSize: 28}} href="https://hotels.cloudbeds.com/connect/25504#/dashboard">Cloudbeds</a>
            </div>
          </div>
        </div>):""} */}
      </AppBar>
    );
  }
}

const mapStateToProps = state => ({
  ui : state.ui,
});

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
});

const HeaderConnected = connect(mapStateToProps, mapDispatchToProps)(Header);

export default withRouter(withStyles(styles)(HeaderConnected));