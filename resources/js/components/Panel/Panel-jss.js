const styles = () => ({
  root: {
  },
  panelHeader: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  panelIcon: {
    color: '#c5c5c5',
    fontSize: 40,
    cursor: 'pointer'
  },
  panelTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  panelTitle: {
    fontSize: 18,
    padding: 0,
    margin: 0
  },
  panelSubtitle: {
    fontSize: 16,
    marginLeft: 10,
  },
  panelContent: {
    paddingTop: 20,
    marginBottom: 20
  },
  '@media (max-width: 700px)': {
    panelTitleContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    panelSubtitle: {
      marginLeft: 0,
    },
  }
});

export default styles;
