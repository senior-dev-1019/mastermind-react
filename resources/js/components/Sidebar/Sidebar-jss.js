const drawerWidth = 260;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#f5f5f5'
  },
  mainMenu: {
    fontSize: '26px',
    color: 'blue',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minWidth: {
    minWidth: 'auto'
  },
  listItemCall: {
    borderBottom: 'solid 1px #ddd',
  },
  missedCall: {
    color: theme.palette.error.main
  },
  sidebarContent: {
    height: 'calc(100vh - 153px)',
    overflowY: 'auto'
  },
  loadingOffset: {
    height: 400
  }

});
export default styles;