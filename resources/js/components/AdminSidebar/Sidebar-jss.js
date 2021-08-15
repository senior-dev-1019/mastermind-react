const drawerWidth = 260;


const styles = theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerFolded: {
    [theme.breakpoints.up('sm')]: {
      width: 100,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#222222'
  },
  drawerPaperFolded: {
    width: drawerWidth,
    backgroundColor: '#222222'
  },
  divider: {
    borderColor: 'white',
    boxShadow: '3px 2px 12px white',
    marginTop: '70px'
  },
  mainMenu: {
    fontSize: '26px',
    color: 'blue',
    height: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  menuItem: {
    color: 'white',
    borderTop: '1px solid #282828',
    '& a': {
      color: 'white',
      textDecoration: 'none',
      padding: '11px 0px'
    }
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
  logo: {
    width: '93%'
  },
  bottomBlock: {
    color: 'white',
    fontSize: '20px',
    marginTop: '100px',
    marginBottom: '24px',
    textAlign: 'center'
  },
  tabletg: {
    fontSize: '12px',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    margin: '0px auto'
  },
  tabletd: {
    fontSize: '12px',
      fontFamily: 'Arial; sans-serif',
      fontSize: '14px',
      padding: '10px 5px;',
      borderStyle: 'solid',
      borderWidth: '1px',
      oveflow: 'hidden',
      wordBreak: 'normal',
      borderColor: 'black'
  },
  tableth: {
    fontSize: '12px',
    fontFamily: 'Arial; sans-serif',
    fontSize: '14px',
    fontWeight: 'normal',
    padding: '10px 5px',
    borderStyle: 'solid',
    borderWidth: '1px',
    oveflow: 'hidden',
    wordBreak: 'normal',
    borderColor: 'black'
  },
  tableheader: {
    fontSize: '12px',
    backgroundColor: '#dae8fc',
    color: '#333333',
    borderColor: '#ffffff',
    textAlign:'left',
    verticalAlign: 'top'
  },
  tablebody: {
    fontSize: '12px',
    backgroundColor: '#dae8fc',
    color: '#333333',
    borderColor: '#ffffff',
    textAlign:'center',
    verticalAlign: 'top'
  },
  textBlock: {
    float: 'left', 
    textAlign: 'left', 
    marginLeft: '10px', 
    marginTop: '-10px'
  },
  welcomeBlock: {
    paddingTop: '6px', 
    color: '#fff', 
    fontSize: '20px', 
    lineHeight: '1.2', 
    opacity: 0.8, 
    zoom: 1, 
    display: 'inline-block'
  },
  usernameBlock: {
    color: '#fff',
    fontSize: '20px',
    lineHeight: 1.2,
    opacity: 0.8,
    zoom: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '150px',
    display: 'block'

  }
});
export default styles;