import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import { registerUser } from '../../actions/authActions';

const styles = {
    textField: {
        width: '100%',
        marginBottom: 5
    },

    button: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    }
}

class Register extends Component {

    constructor (props) {
        super(props)

        this.state = {
            email: '',
            username: '',
            password: '',
            passRepeat: '',
            errors: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
    If user enters incorrect data during registration, get the 
    error message from the server and put it into the errors state
    */
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors })
        }
    }

    /*
    The value from the input field will save to their respective 
    state everytime the user types something
    */
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            passRepeat: this.state.passRepeat
        }

        this.props.registerUser(userData, this.props.history);
    }

    render() {
        const { classes } = this.props;
        const { errors } = this.state;

        return (
            <Paper style={{ padding: 15 }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        type='email'
                        label='Email'
                        name='email'
                        value={this.state.email}
                        onChange={this.handleChange}
                        className={classes.textField}
                        helperText={errors.email ? errors.email : ''}
                        error={errors.email ? true : false}
                    />
                    <TextField 
                        type='text'
                        label='Username'
                        name='username'
                        value={this.state.username}
                        onChange={this.handleChange}
                        className={classes.textField}
                        helperText={errors.username ? errors.username : ''}
                        error={errors.username ? true : false}
                    />
                    <TextField 
                        type='password'
                        label='Password'
                        name='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                        className={classes.textField}
                        helperText={errors.password ? errors.password : ''}
                        error={errors.password ? true : false}
                    />
                    <TextField 
                        type='password'
                        label='Repeat Password'
                        name='passRepeat'
                        value={this.state.passRepeat}
                        onChange={this.handleChange}
                        className={classes.textField}
                        helperText={errors.passRepeat ? errors.passRepeat : ''}
                        error={errors.passRepeat ? true : false}
                    />
                    <div className={classes.button}>
                        <Button variant='outlined' type='submit'>
                            Sign Up
                        </Button>
                    </div>
                </form>
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    errors: state.errors
})

//Connect this component to its Reducer
export default connect(mapStateToProps, { registerUser })(withRouter(withStyles(styles)(Register)))
