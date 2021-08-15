const styles = theme => ({
  root: {
    padding: 10
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  activePage: {
    fontWeight: 'bold',
    border: 'solid 1px #ddd'
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
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
  filtersContainer: {
    marginTop: 20,
  },
  modalContent: {
    padding: 10
  },
  input: {
    marginTop: 20
  },
  title: {
    flexGrow: 1
  }
});

export default styles;