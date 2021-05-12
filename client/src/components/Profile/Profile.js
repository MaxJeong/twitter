import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { 
	getPostsByUserId,
	getUserProfile
} from '../../actions/profileActions';
import Post from '../Posts/Post';
import LoadingPosts from '../Posts/LoadingPosts';

const styles = {}

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
		items = list && list.map(el => <Post key={el._id} post={el}/>);

        return (
            <div>
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
