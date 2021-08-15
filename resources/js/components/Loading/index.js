import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
  progressContainer:{
    zIndex:'9999999',
    width:'100%',
    height:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  p: {
    width:'100%',
  }
});


class Loading extends React.Component {
  render(){
    const { classes, green,styles, label } = this.props;
    return (
      <div className={classes.progressContainer} style = {styles} >
        {green ? (<CircularProgress className={classes.progress} />) : (<CircularProgress className={classes.progress}  color="secondary" />) }
        {label && (<p className={classes.p} >{label}</p>)}
      </div>
    );
  }
}

Loading.defaultProps = {
  green: true,
}
export default withStyles(styles)(Loading);