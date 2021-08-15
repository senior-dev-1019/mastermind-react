const style = theme => ({
	root: {
		// height: 800,
		display: 'flex',
		backgroundColor: '#212529',
		// padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		[theme.breakpoints.down('md')]: {
      height: 500
    },
	},
	localStream: {
		position: 'absolute',
		width: '300px',
		height: '200px',
		zIndex: 999,
		right: 20,
		bottom: 10,
		'@media (max-width: 1025px)': {
			width: '150px',
			height:'100px',
		},
	},
	otherStream: {
		width: '90%',
		// height: '90%',
		position: 'absolute'
	},
	controls: {
		zIndex: 9999,
		width: '30%',
		display: 'flex',
		justifyContent: 'space-around',
		margin: '0 auto',
		bottom: '5px',
		position: 'absolute'
	},
	snapsContainer: {
		zIndex: 999,
		width: 200,
		height: '100%',
		position: 'absolute',
		left: 0
	},
	snapCtrl: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
		marginTop: '-42px'
	},
	redFab: {
		backgroundColor: 'red',
		color: 'white'
	},
	otherName: {
		position: 'absolute',
    top: '2px',
    color: 'white'
	}
});

export default style;