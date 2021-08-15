import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { fromJS } from "immutable";
import { withRouter } from 'react-router'
import styles from './Breadcrumbs-jss.js'

const crumbTranslation = {
  "app":             { name:"Main",  'path':'/app' },
  "users":           { name:"Users", 'path':'/app/users' },
  "calls":           { name:"Calls", 'path':'/app/calls' },
  "video-config":    { name:"Video config", 'path':"/app/video-config" },
  "hiring":          { name:"Hiring", 'path':'/app/hiring' },
  "end-reports":     { name:"End reports", 'path':'/app/end-reports' } ,
  "end-report":     { name:"End report", 'path':'/app/end-reports' } ,
  "shift-manager" :  { name:"Shift manager", 'path':'/app/shift-manager' },
  "statistics":      { name:"Statistics", 'path':'/app/statistics' },
  "user":            { name:"Users", 'path':'/app/users' },
}

class Breadcrumbs extends Component {
  namePipe(input) {
    return (input[0].toUpperCase() + input.substring(1))
      .replace('-', ' ')
  }

  renderCrumbs(){
    const { crumbs, classes } = this.props;
    var data = this.props.location.pathname.substring(1).split('/');

    const a = <div className={classes.rightPosed}>
      {data.map((element, index) => {
        const transformedElement = crumbTranslation[element];
        
        if(index==data.length-1)
        return <a className={classes.bcRef} style={{color: '#1d9fa0'}} key={`bc_${element}_${index}`}
        onClick={()=>this.props.history.push(`${transformedElement.path}`)}>
          {/* {this.namePipe(element)}  */}
          {transformedElement== null ? element : transformedElement.name}
        </a>
        else
        return <div onClick={()=>this.props.history.push(`${transformedElement.path}`)} style={{cursor: 'pointer', display: 'inline-block'}}
        key={`bc_${element}_${index}`}> 
          <a className={classes.bcRef} style={{color: '#1d9fa0'}}>
          {transformedElement== null ? element : transformedElement.name}</a>
        <span className={classes.bcRef}>></span></div>
      })}
      </div>
console.log(a)
    return a;

    return crumbs.map((crumb, index) => (
      <span key={crumb.get('url')}>
        <Link className={classes.breadcrumb} to={crumb.get('url')} >{crumb.get('title')}</Link>
        {crumbs.size - index !== 1 && <span className={classes.separator}>/</span>}
      </span>
    ))
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.renderCrumbs()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  crumbs: state.ui.get('crumbs'),
});

const mapDispatchToProps = dispatch => ({
  // logout: bindActionCreators(logout, dispatch)
});
const BreadMapped = connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs)
export default withRouter(withStyles(styles)(BreadMapped));
