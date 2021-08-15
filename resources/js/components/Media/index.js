import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  content2:{
    textAlign: 'center'
  },
  content:{
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    '& img':{
        marginTop: 40,
        maxWidth: '80%'
    }
  },
  video: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  iframeContainer: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    height: 700,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iframe: {
    width: 800,
    height:600
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }


  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  renderContentByType(type){
    const {classes, file, title } = this.props;
    switch(type){
      case 'pdf':
        return (
          <div>
            <object id="pdf_content" width="100%" height="1500px" type="application/pdf" trusted="yes" application="yes" title={title} data={file}>
              <p>System Error - This PDF cannot be displayed.</p>
            </object>
          </div>
        );
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'iframe':
        return (
          <div className={classes.iframeContainer}>
            <iframe src={file} className={classes.iframe} />
          </div>
        );
      case 'svg':
        return (
          <div className={classes.content}>
            <img src={file} alt={title} />
          </div>
        );
        case 'mp4':
        return (
          <div className={classes.video}>
            <object width="600" height="600" data={file}></object>
          </div>
        );
        default :
        return (<div className={classes.content2}>
            {this.props.thumbnail && (
                <img style={{maxWidth: 123}} src={this.props.thumbnail} alt={title}/>
            )} <p><a href={file} download>Download {title}</a></p>
        </div>);
    }
  }
  render() {
    const {
      classes,
      title,
      actionButton,
      type,
      className,
      thumbnail
    } = this.props;

    return (
      <div className={className}>
        {actionButton ? actionButton(() => this.handleClickOpen()) : <a href="" onClick={ev => {ev.preventDefault(); this.handleClickOpen(); } }>{title}</a>}
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={() => this.handleClose()}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography color="inherit" className={classes.flex}>
                {title}
              </Typography>
              <Button color="inherit" onClick={() => this.handleClose()}>
              <CloseIcon /> close
              </Button>
            </Toolbar>
          </AppBar>
          <div>
            {this.renderContentByType(type)}
          </div>
        </Dialog>
      </div>
    );
  }
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);