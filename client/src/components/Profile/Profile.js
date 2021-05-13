import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import { 
	getPostsByUserId,
	getUserProfile
} from '../../actions/profileActions';
import Post from '../Posts/Post';
import LoadingPosts from '../Posts/LoadingPosts';

const styles = {
    paper: {
		padding: 10
	},

	username: {

	},

	email: {
		color: '#888',
		marginBottom: 10
	},

	detailsBlock: {
		display: 'flex'
	},

	detail: {
		marginRight: 5,
		fontWeight: 'bold'
	},

	detailTitle: {
		marginLeft: 3,
		textTransform: 'uppercase',
		fontSize: 10,
		fontWeight: 'normal'
	},

	btnBlock: {
		width: '100%',
		textAlign: 'right'
	},

	btnFollow: {

	}
}

class Profile extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getPostsByUserId(this.props.match.params.userId);
        this.props.getUserProfile(this.props.match.params.userId);
    }

    render() {
        const { 
			classes,
			loadingPosts,
			loadingProfile,
			list,
			auth,
			user,
			profile 
		} = this.props

        let items;
        let profileInfo;
        let followBtns;
		items = list && list.map(el => <Post key={el._id} post={el}/>);

        /*
        If the current user is authenticated and didn't follow the user
        on their profile page, show the follow button
        */
        if (auth.isAuthenticated) {
            if (user.following.indexOf(this.props.match.params.userId) === -1) {
                followBtns = (<div className={classes.btnBlock}>
                    <Button variant='outlined' className={classes.btnFollow}>
                        Follow
                    </Button>
                </div>)
            } else {
                followBtns = (<div className={classes.btnBlock}>
                    <Button variant='outlined' className={classes.btnFollow}>
                        Unfollow
                    </Button>
                </div>)
            }
        }

        //If profile and items are not null, retrieve user information
        if (profile && items) {
            profileInfo = (
				<Paper className={classes.paper}>
                    <h1 className={classes.username}>{profile.username}</h1>
                    <div className={classes.email}>{profile.email}</div>
                    <div className={classes.detailsBlock}>
                        <div className={classes.detail}>
                            {items.length}
                            <span className={classes.detailTitle}>Posts</span>
                        </div>
                        <div className={classes.detail}>
                            {profile.followers.length}
                            <span className={classes.detailTitle}>Followers</span>
                        </div>
                        <div className={classes.detail}>
                            {profile.following.length}
                            <span className={classes.detailTitle}>Following</span>
                        </div>
                        { followBtns }
                    </div>
                </Paper>
			)
        }

        return (
            <div>
                { loadingProfile ? <div>Loading</div> : profileInfo }
                { loadingPosts ? <LoadingPosts /> : items }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
	loadingPosts: state.post.loading,
	list: state.post.list,
	profile: state.profile.user,
	loadingProfile: state.profile.loading,
	auth: state.auth,
	user: state.auth.user
})

export default connect(mapStateToProps, 
    { 
        getPostsByUserId,
        getUserProfile
    })(withStyles(styles)(Profile));
