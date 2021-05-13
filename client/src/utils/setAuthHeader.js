import axios from 'axios';

//Add token to the request header if it exists.
export default function (token) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else {
		axios.defaults.headers.common['Authorization'] = null;
	}
}
