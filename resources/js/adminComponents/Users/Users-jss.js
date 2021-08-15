const styles = theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  filterInput: {
    background: 'white',
    marginLeft: 20,
    width: 210
  },
  gray: {
    color: '#949494'
  },
  mainContent: {
    maxHeight: window.innerHeight - 300,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  selectBox: {
    font: 'inherit',
    width: '100%',
    height: '25px',
    margin: '0',
    display: 'block',
    paddingTop: '6px',
    paddingBottom: '7px',
    minWidth: '0px',
    boxSizing: 'content-box'
  },
  filtersContainer: {
    marginTop: 20,
    marginBottom: 20
  },
  modalContent: {
    padding: 10
  },
  input: {
    marginTop: 20
  },
  title: {
    flexGrow: 1
  },
  userLink: {
    marginLeft: '8px'
  }
});
export default styles;