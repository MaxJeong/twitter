import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from '../constants';
import setAuthHeader from '../utils/setAuthHeader';

/*
Send the userData to its user

After setting the header, use getCurrentUser action to
get user data from the server
*/
export const loginUser = (userData) => dispatch => {
	axios.post('/api/users/login', userData)
		.then(res => {
			const { token } = res.data 
			localStorage.setItem('jwtToken', token)
            setAuthHeader(token)
            dispatch(getCurrentUser())
		})
		.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
}

/*
Send the userData to the server and dispatch any 
errors to the error reducer
*/
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }))
}

/*
After a user logs in, dispatch its data to the auth 
reducer to save the data there
*/
export const getCurrentUser = () => dispatch => {
	axios.get('/api/users')
		.then(res => dispatch(setCurrentUser(res.data)))
}

export const setCurrentUser = (data) => {
	return {
		type: SET_CURRENT_USER,
		payload: data
	}
}

/*
After user logs out, delete the token in local storage
*/
export const logoutUser = () => dispatch => {
	localStorage.removeItem('jwtToken')
	setAuthHeader()
	dispatch(setCurrentUser())
}
