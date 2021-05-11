import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
	load: {
		textAlgin: 'center',
		marginTop: 25,
		width: '100%'
	}
}

const LoadingPosts = ({ classes }) => (
	<div className={classes.load}>
		<CircularProgress />
	</div>
)	

export default withStyles(styles)(LoadingPosts);
