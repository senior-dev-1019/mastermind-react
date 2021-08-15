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
import Loading from '../Loading';

class AgoraCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.userId = getCookie('id');
    this.client = {};
    this.localStream = {};
    this.remoteSteam = null;
    this.otherStreamId = null;
    this.state = {
      snapLoading: false,
      snaps: [],
      rotate: 180,
      loading: true
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

  // init RTCclient
  initClient() {
    const { appId } = this.props;
    this.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
    return new Promise(resolve => {
      this.client.init(appId, () => {
        resolve('initService success');
      });
    }).catch(e => {
      console.log(e)
    });
  }

  joinChannel() {
    const { appId, channel } = this.props;
    const that = this;
    console.log('joining chanel')
    return new Promise(resolve => {
      that.client.join(
        appId,
        channel, // channel
        null,
        uid => {
          that.uid = uid;
          resolve('joinChannel success');
        },
      );
    });
  }
  streamConfig() {
    console.log('configuring stream');
    const { videoProfile } = this.props;
    const that = this;
    return new Promise(resolve => {
      // audio-video
      const stream = AgoraRTC.createStream({
        streamID: that.uid,
        video: true,
        audio: true,
        screen: false,
      });
      stream.setVideoProfile(videoProfile);
      that.localStream = stream;
      resolve('streamConfig audio-video done');
    });
  }

  streamInit() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.localStream.init(() => {
        self.localStream.play("local_stream");
        self.client.publish(self.localStream, err => {
          console.log(err)
          reject('Publish local stream error: ' + err);
        });
        resolve('streamInit success');
      }, error => {
        console.log('Local Stram Initialization error', error)
        reject(error);
      });
    });
  }

  componentWillMount() {
    let $ = this.props;
    const self = this;
    // init AgoraRTC local client
    AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
    this.initClient()
      .then(() => self.subscribeStreamEvents())
      .then(() => self.joinChannel())
      .then(() => self.streamConfig())
      .then(() => self.streamInit())
      .catch(e => console.log('eeee', e));
  }

  componentWillUnmount () {
    try{
      this.client && this.client.unpublish(this.localStream);
      this.localStream.close && this.localStream.close();
      this.client && this.client.leave(() => {
        console.log('Client succeed to leave.')
      }, () => {
        console.log('Client failed to leave.')
      });
      if(this.interval){
        clearInterval(this.interval);
        this.interval = null;
      }
    }catch(e){
      console.log('error', e);
    }
  }



  subscribeStreamEvents(){
    const self = this;
    // add stream
    try {
      self.client.on('stream-added', evt => {
        let stream = evt.stream;
        self.client.subscribe(stream, err => {
          console.log('Subscribe stream failed', err);
        });
      });
    } catch (e) {
      console.error(e);
      toast(' Call Ended By Caller');
      self.props.stopCall();
    }

    self.client.on('stream-subscribed', function(evt) {
      try{
        self.remoteSteam = evt.stream;
        self.otherStreamId = self.remoteSteam.getId();
        console.log('other stream id', self.otherStreamId)
        self.setState({ loading: false });
        self.remoteSteam.play("other_stream", { fit: "contain" }, (error) => {
          console.log(error)
          if (self.remoteSteam) {
            self.setDefaultRotation();
          }
        });
      } catch (e){
        console.log(e)
        toast(' Call Ended By Caller');
        self.props.stopCall();
      }
    })

    self.client.on("stream-removed", function (evt) {
      try{
        let stream = evt.stream;
        self.removeStream(stream.getId());
      }catch(e){
        toast(' Call Ended By Caller');
        self.props.stopCall();
      }
    });

    self.client.on('peer-leave', function (evt) {
      try{
        self.removeStream(evt.uid);
        toast(' Call Ended');
        self.props.stopCall();
      }catch(e){
        toast(' Call Ended By Caller');
        self.props.stopCall();
      }
      // endCall
    });

    self.client.on("error", (err) => {
      console.log('error', err)
    });

  }

  removeStream(uid){
    if(this.remoteSteam){
      try{
        this.remoteSteam.close ? this.remoteSteam.close() : console.log('Remote stream is not present.');
        let element = document.querySelector('#player_' + uid);
        if (element) {
          element.parentNode.removeChild(element);
        }
      }catch(e){
        console.log('A small error. Nothing 2 bad!', e);
      }
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
    const itemHeight = window.innerHeight - 150;
    const itemWidth = window.innerWidth - 540;
		return (
			<div className={classes.root} style={{ height: itemHeight, width: itemWidth }} >
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
				<div className={classes.otherStream} style={{ height: itemHeight - 250 }} id={"other_stream"} >
          {this.state.loading && <Loading />}
        </div>
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