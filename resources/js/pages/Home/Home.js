import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import UserStateWidget from '../../components/UserState';
import MissedCallsWidget from '../../components/MissedCalls';
import Conference from '../../components/Conference';
import Loading from '../../components/Loading';
import { getCookie } from '../../utils/cookie';

class Home extends Component {
  componentWillMount(){
    this.props.getCalls();
    this.props.getContacts();
    this.props.listMissingCalls();
  }
  endCall(){
    const me = getCookie('id');
    let hotel;
    const { endCall, calling } = this.props;
    if (calling.getIn(['incommingCall', 'id_call'])) {
      if(me == calling.getIn(['incommingCall', 'id_caller'] )) {
        hotel = calling.getIn(['incommingCall', 'id_target']);
      }else{
        hotel = calling.getIn(['incommingCall', 'id_caller']);
      }
      endCall({
        id_call: calling.getIn(['incommingCall', 'id_call']),
        name_caller: getCookie('name'),
        id_target: hotel,
        action: 'reject'
      });
    }else{
      if(me == calling.getIn(['activeCall', 'id_caller'] )) {
        hotel = calling.getIn(['activeCall', 'id_target']);
      }else{
        hotel = calling.getIn(['activeCall', 'id_caller']);
      }
      endCall({
        id_call: calling.getIn(['activeCall', 'id_call']),
        name_caller: getCookie('name'),
        id_target: hotel,
        action: 'hangup'
      });
    }

    this.props.loading();
    this.props.getCalls();
    this.props.getContacts();
    this.props.listMissingCalls();
  }

  renoveMissedCall(caller_id){
    const that = this;
    this.props.removeMissedCall(caller_id, res => {
      that.props.loading();
      that.props.getCalls();
      that.props.getContacts();
      that.props.listMissingCalls();
    });
  }

  render() {
    const { classes, calling } = this.props;

    return (
      <div className={classes.root}>
        <Helmet>
          <title>Home</title>
          <link rel="icon" href="/images/logo.png" sizes="32x32" />
        </Helmet>
        <div className={classes.content}>
          {!calling.get('activeCall').get('id_call') && (
            <Fragment>
              <div className={classes.userStateContainer}>
                <UserStateWidget
                  online={this.props.user.get('online')}
                  setOnline={( online ) => this.props.setOnline(online)}
                />
              </div>
              <div className={classes.missedCallsContainer} >
                <MissedCallsWidget
                  removeMissedCall={(id) => this.renoveMissedCall(id)}
                />
              </div>
            </Fragment>
          )}
          {calling.get('loading') && <Loading />}
          {calling.get('activeCall').get('id_call') && (
            <Conference
              user={this.props.user}
              calling={this.props.calling}
              videoProfile={'120p'}
              channel={`${calling.getIn(['activeCall', 'id_call'])}`}
              appId={'f80c593662e643b9bb523141d27a086c'}
              uid={null}
              endCall={this.endCall.bind(this)}
              stopCall={() => this.props.stopCall()}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
