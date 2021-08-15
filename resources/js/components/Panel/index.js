import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import styles from './Panel-jss';

class CollapsiblePanel extends Component {
  render() {
    const {
      classes,
      collapsed,
      title,
      subtitle
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.panelHeader}>
          <div className={classes.panelTitleContainer}>
            <h2 className={classes.panelTitle}>{title}</h2>
            {subtitle && <p className={classes.panelSubtitle}>{subtitle}</p>}
          </div>
          <div className={classes.panelControls}>
            {!collapsed && <KeyboardArrowDown className={classes.panelIcon} onClick={() => this.props.onToggleCollapse(true)} />}
            {collapsed && <KeyboardArrowUp className={classes.panelIcon} onClick={() => this.props.onToggleCollapse(false)} />}
          </div>
        </div>
        {collapsed && (
          <div className={classes.panelContent}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

CollapsiblePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.any.isRequired,
  subtitle: PropTypes.string,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func
};

CollapsiblePanel.defaultProps = {
  collapsed: false,
  subtitle: '',
  onToggleCollapse: () => {}

};

export default withStyles(styles)(CollapsiblePanel);
