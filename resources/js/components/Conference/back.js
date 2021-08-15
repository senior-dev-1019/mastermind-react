import React from 'react';
import { merge } from 'lodash';
import AgoraRTC from 'agora-rtc-sdk';
import styles from './Conference-jss';
import {
	Fab
} from '@material-ui/core';
import CallEnd from '@material-ui/icons/CallEnd';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Delete from '@material-ui/icons/Delete';
import Send from '@material-ui/icons/Send';
import Update from '@material-ui/icons/Update';
// import Mic from '@material-ui/icons/Mic';
// import MicOff from '@material-ui/icons/MicOff';
import RotateRight from '@material-ui/icons/RotateRight';
import { withStyles } from '@material-ui/core/styles';
import { toast } from '../../utils/alerts';
import { uploadSnapshot, changeHotelConfig } from '../../redux/actions/calling';
import { getCookie } from '../../utils/cookie';

class AgoraCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.userId = getCookie('id');
    this.client = {};
    this.localStream = {};
    this.remoteSteam = null;
    this.otherStreamId = null;
    this.state = {
      displayMode: 'pip',
			streamList: [],
      readyState: false,
      snapLoading: false,
      snaps: [],
      rotate: 180
    }
  }

  componentDidMount(){
    let couter = 32;
    this.interval = setInterval(() => {
      couter = couter - 1;
      if(couter === 0){
        if(!this.remoteSteam){
          this.props.stopCall();
          clearInterval(this.interval);
        }else{
          clearInterval(this.interval);
        }
      }
    }, 1000);
  }
  componentWillMount() {
    let $ = this.props
    // init AgoraRTC local client
    AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
    this.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });

    this.client.init($.appId, () => {
      this.subscribeStreamEvents();
      // this.client.configPublisher({
      //   width: 160,
      //   height: 120,
      //   framerate: 5,
      //   bitrate: 500,
      // })
      this.client.join($.appId, $.channel, null, (uid) => {
        // create local stream
        // It is not recommended to setState in function addStream
        this.localStream = this.streamInit(uid, $.videoProfile)
        this.localStream.init(() => {
          try{
            this.localStream.play("local_stream");
            this.client.publish(this.localStream, err => {
              console.log("Publish local stream error: " + err);
            });
          }catch(e){
            console.log(e);
            toast('Can not use your camera.');
          }

        },
          err => {
            console.log("getUserMedia failed", err);
            toast(' Your camera is used by other application or you did not allowed camera access to chrome');
            this.setState({ readyState: true })
          });
      });
    });
  }

  componentWillUnmount () {
    try{
      this.client && this.client.unpublish(this.localStream);
      this.localStream && this.localStream.close();
      this.client && this.client.leave(() => {
        console.log('Client succeed to leave.')
      }, () => {
        console.log('Client failed to leave.')
      });
      if(this.interval){
        clearInterval(this.interval);
      }
    }catch(e){
      console.log('error', e);
    }
  }

  streamInit(uid, videoProfile, config){
    let defaultConfig = {
      streamID: uid,
      audio: true,
      video: true,
      screen: false
    }
    let stream = AgoraRTC.createStream(merge(defaultConfig, config))
    stream.setVideoProfile(videoProfile)
    return stream;
  }

  subscribeStreamEvents(){
    let rt = this;
    rt.client.on('stream-added', function (evt) {
      try{
        let stream = evt.stream;
        rt.client.subscribe(stream, function (err) {
          console.log("Subscribe stream failed", err);
        });
      }catch(e){
        toast(' Call Ended By Caller');
        rt.props.stopCall();
      }
    })
    rt.client.on("error", (err) => {
      console.log('error', err)
    })
    rt.client.on('peer-leave', function (evt) {
      try{
        rt.removeStream(evt.uid);
        toast(' Call Ended');
        rt.props.stopCall();
      }catch(e){
        toast(' Call Ended By Caller');
        rt.props.stopCall();
      }
      // endCall
    })

    rt.client.on('stream-subscribed', function (evt) {
      try{
        rt.remoteSteam = evt.stream;
        rt.otherStreamId = rt.remoteSteam.getId();
        rt.remoteSteam.play("other_stream", {fit: "contain"}, (error) => {
          if (rt.remoteSteam) {
            rt.setDefaultRotation();
          }
        });
      }catch(e){
        toast(' Call Ended By Caller');
        rt.props.stopCall();
      }
    })

    rt.client.on("stream-removed", function (evt) {
      try{
        let stream = evt.stream;
        rt.removeStream(stream.getId());
      }catch(e){
        toast(' Call Ended By Caller');
        rt.props.stopCall();
      }
    })
  }

  removeStream(uid){
    if(this.remoteSteam){
      try{
        this.remoteSteam.close();
      }catch(e){
        console.log('A small error. Nothing 2 bad!', e);
      }
    }
    let element = document.querySelector('#player_' + uid);
    if (element) {
      element.parentNode.removeChild(element);
    }
  }

  makeScreenShot(){
    let to = this.props.calling.getIn(['activeCall', 'id_target']);
    let id_caller = this.props.calling.getIn(['activeCall', 'id_caller']);
    let hotel;
    if(this.userId == to){
      hotel = id_caller;
    }else{
      hotel = to;
    }
    this.setState({snapLoading: true});
    let that = this;
    changeHotelConfig(hotel, 1).then(() => {
      if(that.remoteSteam){
        setTimeout(() => {
          let scaleFactor = 1;
          let video = document.getElementById('video'+that.remoteSteam.getId());
          let w = video.videoWidth * scaleFactor;
          let h = video.videoHeight * scaleFactor;
          let canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          let ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, w, h);
          let dataURL = canvas.toDataURL();
          let snaps = that.state.snaps;
          snaps.push(dataURL);
          that.setState({ snaps, snapLoading: false });
          changeHotelConfig(hotel, 0);
        }, 3000);
      }
    });
  }

  rotateRemoteStream(){
    try{
      let video = document.getElementById('video'+this.remoteSteam.getId());
      let deg = this.state.rotate + 90;
      if(deg >= 360){
        deg = 0;
      }
      video.style.webkitTransform = 'rotate('+deg+'deg)';
      video.style.mozTransform    = 'rotate('+deg+'deg)';
      video.style.msTransform     = 'rotate('+deg+'deg)';
      video.style.oTransform      = 'rotate('+deg+'deg)';
      video.style.transform       = 'rotate('+deg+'deg)';
      this.setState({ rotate: deg });
      localStorage.setItem('rotation', deg);
    }catch(e){
      console.log(e);
    }
  }
  setDefaultRotation(){
    try{
      let video = document.getElementById('video'+this.remoteSteam.getId());
      const deg = localStorage.getItem('rotation') || 0;
      video.style.webkitTransform = 'rotate('+deg+'deg)';
      video.style.mozTransform    = 'rotate('+deg+'deg)';
      video.style.msTransform     = 'rotate('+deg+'deg)';
      video.style.oTransform      = 'rotate('+deg+'deg)';
      video.style.transform       = 'rotate('+deg+'deg)';
      this.setState({ rotate: deg });
    } catch (e){
      console.log(e)
    }
  }
  removeSnap(index, stop_notice){
    let snaps = this.state.snaps;
    snaps.splice(index, 1);
    this.setState({snaps});
    if(!stop_notice){
      toast(' Snapshot Deleted', "success");
    }

  }

  uploadSnapshot(index){
    const id_call = this.props.calling.getIn(['activeCall', 'id_call']);
    uploadSnapshot(id_call, this.state.snaps[index].replace('data:image/png;base64,','')).then( () => {
      this.removeSnap(index, true);
      toast(' Snapshot Uploaded', "success");
    })
  }

  render() {
    const { classes, calling } = this.props;
    const itemHeight = window.innerHeight;
		return (
			<div className={classes.root} style={{ height: itemHeight - 150 }} >
        <h2 className={classes.otherName}>{calling.get('otherName')}</h2>
        <div className={classes.snapsContainer}>
          {this.state.snaps.map((snap, index) => (
            <div key={`snap${index}`} className={classes.snap}>
              <img src={snap} alt={"snap"} width={200} />
              <div className={classes.snapCtrl}>
                <Fab size="small" classes={{ primary: classes.redFab}} onClick={() => this.removeSnap(index)} color={"primary"}><Delete /></Fab>
                <Fab size="small" onClick={() => this.uploadSnapshot(index)} color={"primary"}><Send /></Fab>
              </div>
            </div>
          ))}
        </div>
				<div className={classes.localStream} id={"local_stream"} />
				<div className={classes.otherStream} style={{ height: itemHeight - 250 }} id={"other_stream"} />
				<div className={classes.controls}>
          {this.state.snapLoading ?
            <Fab size="small" color={"primary"}><Update /></Fab>
            :
            <Fab  size="small" onClick={() => this.makeScreenShot()} color={"primary"}><PhotoCamera /></Fab>
          }
          <Fab size="small" onClick={() => this.rotateRemoteStream()}><RotateRight /></Fab>
					<Fab size="small" classes={{ primary: classes.redFab}} color={"primary"} onClick={() => this.props.endCall()} ><CallEnd /></Fab>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(AgoraCanvas);