import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getPosts } from '../../actions/postActions';
import AddPost from './AddPost';
import Post from './Post';
import LoadingPosts from './LoadingPosts';

class ListPost extends Component {

	constructor(props) {
		super(props)

		this.state = {
			allPosts: true
		}
	}

	componentDidMount() {
		this.props.getPosts();
	}
	
	render() {
		const { list, loading } = this.props;
		
		const items = list && list.map(el => <Post key={el._id} post={el} />);
		return (
			<div>
                <AddPost />
				{ loading ? <LoadingPosts /> : items }
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	list: state.post.list,
	loading: state.post.loading
});

export default connect(mapStateToProps, { getPosts })(ListPost);
