const Validator = require('validator');

module.exports = function (data) {
    let errors = {};

    /*
    Save an email error message to be sent to the client 
    based on different cases
    */
    
    if (Validator.isEmpty(data.email)) {
        errors.email = 'An Email is required.';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'The Email is invalid.';
    }

    /*
    Save a username error message to be sent to the client 
    based on different cases
    */

    if (Validator.isEmpty(data.username)) {
        errors.username = 'A Username is required.';
    } else if (!Validator.isLength(data.username, { min: 3, max: 16 })) {
        errors.username = 'The Username must be between 3 to 16 characters.';
    }

    /*
    Save a password error message to be sent to the client 
    based on different cases
    */

    if (Validator.isEmpty(data.password)) {
        errors.password = 'A Password is required.';
    } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'The Password must be between 6 to 30 characters.';
    }

    /*
    Save a password confirmation error message to be sent to 
    the client based on different cases
    */

    if (Validator.isEmpty(data.passRepeat)) {
        errors.passRepeat = 'You must confirm your password.';
    } else if (!Validator.equals(data.password, data.passRepeat)) {
        errors.passRepeat = 'The passwords must match.';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}
