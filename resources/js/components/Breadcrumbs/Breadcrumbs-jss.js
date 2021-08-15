const styles = theme => ({
  appBar: {
    marginLeft: '0px',
    height: 80
  },
  adminAppBar: {
    height: 80,
  },
  emptyDiv: {
    flexGrow: 1
  },
  flexToolbar: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end', 
    backgroundColor: '#212529', 
  },
  fabIcon: {
    paddingLeft:10
  },
  logo: {
    height: '77px'
  },
  refStyle: {
    fontSize: 24, 
    color: 'blue', 
    fontSize:28
  },
  bcRef: {
    fontSize: 20, 
    marginRight: '8px', 
    color: '#1d9fa0',
    cursor: 'pointer'
  },
  middlePosed: {
    marginLeft: 'auto', 
    marginRight: 'auto',
    cursor: 'pointer'
  },
  rightPosed: {
    marginRight: 'auto'
  },
  timeSpan: {
    justifyContent: 'flex-end', 
    display: 'block',
    textAlign: 'center', 
    marginRight: 24, 
    marginLeft: 24, 
    color: 'white'
  },
  modalContent: {
    padding: '10',
    minWidth:'200px', 
    minHeight:'400px'
  },
  breadcrumb: {
    fontSize: 20,
    textDecoration: 'none',
    color: '#1d9fa0'
  },
  separator: {
    padding: '0px 10px',
    color: '#1d9fa0'
  },
  manual: {
    justifyContent: 'flex-end',  
    marginRight: 36, 
    onSize: 24, 
    textDecoration:'underline', 
    color: '#1d9fa0', 
    fontSize:20
  },
  smallLeftMargin: {
    marginLeft: 10
  },
  linkWrapper: {
    left: '40%', 
    top:'30%', 
    position:'absolute', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    justifyContent: 'space-between', 
    flexDirection: 'column'
  },
  popupLinks: {
    textDecoration:'underline', 
    color: '#1d9fa0', 
    fontSize: 28
  },
  centerItems: {
    alignItems:'center'
  }
});
export default styles;