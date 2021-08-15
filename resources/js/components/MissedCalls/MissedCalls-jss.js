const styles = theme => ({
	root: {
		width: '100%',
		maxWidth: 500,
		[theme.breakpoints.down('md')]: {
      width: 400,
    },
		backgroundColor: theme.palette.background.paper,
	},
	listItems: {
		width: 500,
		[theme.breakpoints.down('md')]: {
      width: 400,
		},
	},
	listItem: {
		borderBottom: 'solid 1px #ddd',
		color: 'red',
		'& p': {
			color: 'red'
		}
	}
});

export default styles;