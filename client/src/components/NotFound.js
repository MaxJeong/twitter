import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
	<div style={{ textAlign: 'center' }}>
		<h2>404</h2>
		<h3>Page not found</h3>
		<Link to="/">Return to home page</Link>
	</div>
)

export default NotFound;
